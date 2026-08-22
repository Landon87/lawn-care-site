import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GrassBlades({ count = 2000, width = 20, depth = 15 }) {
  const meshRef = useRef()
  
  // Create grass blade geometry - simple tapered plane
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.06, 0.8, 1, 3)
    const positions = geo.attributes.position.array
    
    // Taper the blade toward the top
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1]
      const normalizedY = (y + 0.4) / 0.8
      const taper = 1.0 - (normalizedY * 0.7)
      positions[i] *= taper
    }
    
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])
  
  // Create material with custom shader for wind
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        uniform float time;
        uniform float windStrength;
        
        attribute float aScale;
        attribute float aRotation;
        
        varying vec2 vUv;
        varying float vHeight;
        
        void main() {
          vUv = uv;
          vHeight = position.y + 0.4;
          
          // Wind effect using simple sine waves
          float windX = sin(time * 1.5 + instanceMatrix[3][0] * 0.5) * windStrength * vHeight * vHeight;
          float windZ = cos(time * 1.2 + instanceMatrix[3][2] * 0.3) * windStrength * 0.5 * vHeight * vHeight;
          
          // Apply rotation around Y axis
          float c = cos(aRotation);
          float s = sin(aRotation);
          
          vec3 pos = position;
          pos.x = position.x * c - position.z * s;
          pos.z = position.x * s + position.z * c;
          
          // Apply wind
          pos.x += windX;
          pos.z += windZ;
          
          // Apply scale
          pos *= aScale;
          
          vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vHeight;
        
        void main() {
          // Emerald green colors matching the logo
          vec3 bottomColor = vec3(0.04, 0.31, 0.10);  // #0a501a - dark green
          vec3 topColor = vec3(0.20, 0.47, 0.18);     // #32782d - primary green
          vec3 highlightColor = vec3(0.49, 0.65, 0.30); // #7da74c - light green
          
          // Mix colors based on height
          vec3 color = mix(bottomColor, topColor, vHeight);
          color = mix(color, highlightColor, vHeight * vHeight * 0.3);
          
          // Add subtle variation
          color += sin(vUv.x * 20.0) * 0.02;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        time: { value: 0 },
        windStrength: { value: 0.15 }
      },
      side: THREE.DoubleSide
    })
  }, [])
  
  // Create instance data
  const instanceData = useMemo(() => {
    const scales = new Float32Array(count)
    const rotations = new Float32Array(count)
    const positions = []
    
    for (let i = 0; i < count; i++) {
      scales[i] = 0.6 + Math.random() * 0.6
      rotations[i] = Math.random() * Math.PI * 2
      
      positions.push({
        x: (Math.random() - 0.5) * width,
        y: 0,
        z: (Math.random() - 0.5) * depth
      })
    }
    
    return { scales, rotations, positions }
  }, [count, width, depth])
  
  // Set up instanced attributes and matrices
  useEffect(() => {
    if (!meshRef.current) return
    
    const mesh = meshRef.current
    const geo = mesh.geometry
    
    // Add instance attributes
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(instanceData.scales, 1))
    geo.setAttribute('aRotation', new THREE.InstancedBufferAttribute(instanceData.rotations, 1))
    
    // Set instance matrices
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        instanceData.positions[i].x,
        instanceData.positions[i].y,
        instanceData.positions[i].z
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [instanceData, count])
  
  // Animate wind
  useFrame((state) => {
    if (material) {
      material.uniforms.time.value = state.clock.elapsedTime
    }
  })
  
  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[60, 40]} />
      <meshBasicMaterial color="#0a501a" />
    </mesh>
  )
}

// Check if WebGL is supported
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    ))
  } catch (e) {
    return false
  }
}

// Check if mobile device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// CSS fallback for non-WebGL or mobile
function CSSGrassFallback() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #f0f7eb 0%, #c0d9a6 40%, #7da74c 70%, #32782d 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Animated grass blades using CSS */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${Math.random() * 100}%`,
            width: '3px',
            height: `${60 + Math.random() * 100}px`,
            background: `linear-gradient(to top, #0a501a, ${Math.random() > 0.5 ? '#32782d' : '#7da74c'})`,
            borderRadius: '50% 50% 0 0',
            transformOrigin: 'bottom center',
            animation: `sway ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        />
      ))}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

export default function GrassBackground() {
  const [useWebGL, setUseWebGL] = useState(true)
  const [bladeCount, setBladeCount] = useState(2000)

  useEffect(() => {
    // Check WebGL support
    if (!isWebGLSupported()) {
      setUseWebGL(false)
      return
    }
    
    // Reduce blade count on mobile
    if (isMobile()) {
      setBladeCount(800)
    }
  }, [])

  // Use CSS fallback if WebGL not supported
  if (!useWebGL) {
    return <CSSGrassFallback />
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
        gl={{ 
          antialias: !isMobile(), 
          alpha: true,
          powerPreference: isMobile() ? 'low-power' : 'high-performance'
        }}
        style={{ 
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
        dpr={isMobile() ? [1, 1] : [1, 1.5]}
      >
        <fog attach="fog" args={['#f0f7eb', 15, 35]} />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />
        
        <GrassBlades count={bladeCount} width={20} depth={15} />
        <Ground />
      </Canvas>
    </div>
  )
}
