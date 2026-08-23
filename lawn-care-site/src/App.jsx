import { useState, Suspense, lazy, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle, Calendar, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GrassBackground = lazy(() => import('./components/GrassBackground'))

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
}

function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '',
    location: '',
    consultation: '',
    maintenance: false,
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '')
    if (phone.length <= 3) return phone
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.propertyType) newErrors.propertyType = 'Please select a property type'
    if (!formData.location) newErrors.location = 'Please select your area'
    if (!formData.consultation) newErrors.consultation = 'Please select a consultation preference'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value
    
    if (name === 'phone') {
      newValue = formatPhoneNumber(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const subject = `New Consultation Request from ${formData.name}`
    const body = `
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Property Type: ${formData.propertyType}
Location: ${formData.location}
Consultation Preference: ${formData.consultation}
Interested in Maintenance: ${formData.maintenance ? 'Yes' : 'No'}

Additional Notes:
${formData.notes}
    `.trim()

    // Store in localStorage for admin dashboard
    const submissions = JSON.parse(localStorage.getItem('bookingSubmissions') || '[]')
    submissions.push({
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: 'new'
    })
    localStorage.setItem('bookingSubmissions', JSON.stringify(submissions))
    
    // Also send email
    window.location.href = `mailto:makersmarg79@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div 
        className="rounded-2xl shadow-lg p-8 text-center" 
        style={{ background: 'rgba(255,255,255,0.9)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Request Sent!</h3>
        <p className="text-gray-600 mb-4">Your email client should open with the details.</p>
        <a href="mailto:makersmarg79@gmail.com" className="text-emerald-600 font-semibold hover:underline">
          makersmarg79@gmail.com
        </a>
      </motion.div>
    )
  }

  return (
    <motion.form 
      className="rounded-2xl shadow-lg p-8 space-y-6" 
      style={{ background: 'rgba(255,255,255,0.7)' }} 
      onSubmit={handleSubmit}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.div className="grid md:grid-cols-2 gap-6" variants={fadeInUp}>
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
            placeholder="Your name" 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength={14}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
            placeholder="(904) 555-0123" 
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </motion.div>
      </motion.div>
      
      <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
          placeholder="you@email.com (optional)" 
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </motion.div>
      
      <motion.div variants={fadeInUp}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
        {errors.propertyType && <p className="text-red-500 text-xs mb-2">{errors.propertyType}</p>}
        <div className="flex gap-4">
          {['Residential', 'Commercial'].map((type) => (
            <motion.label 
              key={type}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input 
                type="radio" 
                name="propertyType" 
                value={type.toLowerCase()} 
                checked={formData.propertyType === type.toLowerCase()}
                onChange={handleChange}
                required
                className="text-emerald-500" 
              />
              <span>{type}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>
      
      <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
        {errors.location && <p className="text-red-500 text-xs mb-2">{errors.location}</p>}
        <select 
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
        >
          <option value="">Select your area</option>
          {['Jacksonville', 'Macclenny', 'St. Augustine', 'Yulee', 'Stance', 'Jax Beach', 'Middleburg', 'Other / Surrounding County'].map((area) => (
            <option key={area} value={area.toLowerCase().replace(/\s+/g, '-').replace('/', '')}>{area}</option>
          ))}
        </select>
      </motion.div>
      
      <motion.div variants={fadeInUp}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Preference *</label>
        {errors.consultation && <p className="text-red-500 text-xs mb-2">{errors.consultation}</p>}
        <div className="flex gap-4">
          {['In-person on property', 'Phone/Virtual'].map((type) => (
            <motion.label 
              key={type}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input 
                type="radio" 
                name="consultation" 
                value={type.toLowerCase().split('/')[0]} 
                checked={formData.consultation === type.toLowerCase().split('/')[0]}
                onChange={handleChange}
                required
                className="text-emerald-500" 
              />
              <span>{type}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>
      
      <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="maintenance"
            checked={formData.maintenance}
            onChange={handleChange}
            className="text-emerald-500 rounded" 
          />
          <span className="text-gray-700">I'm interested in continuous lawn maintenance</span>
        </label>
      </motion.div>
      
      <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea 
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none transition" 
          placeholder="Tell us about your lawn needs..."
        ></textarea>
      </motion.div>
      
      <motion.button 
        type="submit" 
        className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold hover:bg-emerald-600 transition"
        variants={fadeInUp}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(50,120,45,0.5)' }}
        whileTap={{ scale: 0.98 }}
      >
        Request Free Estimate
      </motion.button>
      
      <p className="text-xs text-gray-500 text-center">Or email us directly at <a href="mailto:makersmarg79@gmail.com" className="text-emerald-600 hover:underline">makersmarg79@gmail.com</a></p>
    </motion.form>
  )
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(50,120,45,0.5)' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [hoveredService, setHoveredService] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navItems = ['Services', 'Pricing', 'Service Area', 'About', 'Book', 'Contact']

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.toLowerCase().replace(' ', '-'))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          return
        }
      }
      setActiveSection('')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <GrassBackground />
      </Suspense>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-emerald-900 text-lg">Emeralds Cuts</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => {
              const sectionId = item.toLowerCase().replace(' ', '-')
              const isActive = activeSection === sectionId
              return (
                <motion.button 
                  key={item}
                  onClick={() => scrollToSection(sectionId)}
                  className={`relative transition-colors ${isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-500'}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500"
                    initial={{ scaleX: isActive ? 1 : 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              )
            })}
            <motion.a 
              href="#book"
              className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(50,120,45,0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.a>
          </div>

          <motion.button
            className="md:hidden p-2 text-emerald-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-t border-emerald-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item, i) => {
                  const sectionId = item.toLowerCase().replace(' ', '-')
                  const isActive = activeSection === sectionId
                  return (
                    <motion.button
                      key={item}
                      onClick={() => scrollToSection(sectionId)}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition ${isActive ? 'text-emerald-600 font-semibold bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {item}
                    </motion.button>
                  )
                })}
                <motion.a
                  href="#book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Book Now
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative" style={{ background: 'linear-gradient(to bottom, rgba(240,247,235,0.95), rgba(255,255,255,0.9))', zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.img 
              src="/logo.png" 
              alt="Emeralds Cuts Lawn Services" 
              className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md h-auto drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 10px 30px rgba(10,80,26,0.3))'
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.5 }
              }}
            />
          </motion.div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Professional lawn care services in Jacksonville, FL. 
            Keeping your yard beautiful year-round.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.a 
              href="#book"
              className="bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-emerald-600 transition inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(50,120,45,0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5" />
              Schedule Free Estimate
            </motion.a>
            <motion.button 
              onClick={() => scrollToSection('services')}
              className="border-2 border-emerald-500 text-emerald-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-emerald-50 transition"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(50,120,45,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Our Services
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { value: '5+', label: 'Years' },
              { value: '200+', label: 'Clients' },
              { value: '100%', label: 'Satisfaction' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                variants={scaleIn}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-emerald-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 relative" style={{ background: 'rgba(255,255,255,0.85)', zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything your lawn needs to stay healthy, green, and beautiful.</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: 'Lawn Mowing', desc: 'Weekly or bi-weekly mowing with professional equipment.', image: 'https://scontent-mia5-1.xx.fbcdn.net/v/t1.15752-9/755666923_989573227416148_1935834877220257174_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=xTqbSr497uUQ7kNvwFsVS1i&_nc_oc=AdofKL9fQ6yXauyz_BMTg7sAn-kKYBlWzF1YbI7c9B6TFcOnLurL-EfUa4aFTG2ORLGhBD-CllEeV3XWFTe1qG5T&_nc_zt=23&_nc_ht=scontent-mia5-1.xx&_nc_ss=7b6a8&oh=03_Q7cD6AFLqqVl64NdduQmQqo6gsCjsgd3ZRLUKcWY0QeSSx99UQ&oe=6AB1A480' },
              { title: 'Fertilization', desc: 'Seasonal treatments to keep your grass green and thick.', image: 'https://hips.hearstapps.com/hmg-prod/images/f194d2dc-ebfe-40d5-a66e-dd87abeb5308.jpeg' },
              { title: 'Landscaping', desc: 'Design and maintenance of beds, borders, and gardens.', image: 'https://t4.ftcdn.net/jpg/01/75/33/69/360_F_175336961_mVDHKrNDeFNCebsvI3gXecPOHSrbRgf3.jpg' },
              { title: 'Seasonal Cleanup', desc: 'Spring and fall cleanup to keep your yard tidy.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSon0-lhm_4FiVZAXDUteCsYjLujUEscGLH2OOLY3T-yA&s=10' },
              { title: 'Tree & Shrub Care', desc: 'Trimming, pruning, and health maintenance.', image: 'https://toplawn.com/wp-content/uploads/2024/01/hedges-1024x768.jpg' },
              { title: 'Pest Control', desc: 'Safe, effective treatment for lawn pests and weeds.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgVUBxClHsenwPviEkgiEkkylSBF8Ihy1FN4oBHlVMJg&s' }
            ].map((service, i) => (
              <motion.div
                key={service.title}
                className="rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-white"
                variants={fadeInUp}
                whileHover={{ 
                  y: -10, 
                  boxShadow: '0 20px 40px rgba(10,80,26,0.15)',
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setHoveredService(i)}
                onHoverEnd={() => setHoveredService(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    animate={{ 
                      scale: hoveredService === i ? 1.1 : 1,
                      rotateY: hoveredService === i ? 180 : 0
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-emerald-600 flex items-center justify-center p-6"
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ 
                      opacity: hoveredService === i ? 1 : 0,
                      rotateY: hoveredService === i ? 0 : 180
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-white text-center font-medium">{service.desc}</p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 relative" style={{ background: 'rgba(240,247,235,0.85)', zIndex: 2 }}>
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Pricing</h2>
            <p className="text-gray-600">Straightforward pricing for quality lawn care.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 rounded-2xl shadow-lg overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { service: 'Tree & Shrub Care', desc: 'Per visit', price: '$75' },
              { service: 'Seasonal Cleanup', desc: 'Spring & Fall', price: '$125' },
              { service: 'Lawn Mowing', desc: 'Starting price, varies by yard size', price: '$49+' },
              { service: 'Fertilization', desc: 'Seasonal treatments', price: '$55+' },
              { service: 'Landscaping', desc: 'Contact us for estimate', price: 'Custom Quote' }
            ].map((item, i) => (
              <motion.div
                key={item.service}
                className={`flex items-center justify-between p-6 ${i !== 4 ? 'border-b border-gray-100' : ''} hover:bg-emerald-50/50 transition`}
                variants={fadeInUp}
                whileHover={{ x: 5 }}
              >
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">{item.service}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap ml-4">{item.price}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.p 
            className="text-center text-sm text-gray-500 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Prices may vary based on yard size and condition. Contact us for a free estimate.
          </motion.p>
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="py-20 px-4 relative" style={{ background: 'rgba(255,255,255,0.85)', zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Service Area</h2>
            <p className="text-gray-600 mb-8">Proudly serving Jacksonville and surrounding communities.</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {['Jacksonville', 'Macclenny', 'St. Augustine', 'Yulee', 'Stance', 'Jax Beach', 'Middleburg'].map((area) => (
              <motion.span 
                key={area} 
                className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium cursor-pointer"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#32782d',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(50,120,45,0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {area}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-500 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Residential & Commercial properties welcome
          </motion.p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 text-white relative" style={{ background: 'rgba(10,80,26,0.95)', zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose Emeralds Cuts?</h2>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: '5+', label: 'Years Experience' },
              { number: '200+', label: 'Happy Clients' },
              { number: '100%', label: 'Satisfaction Rate' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                variants={scaleIn}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-emerald-300 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 200 }}
                >
                  {stat.number}
                </motion.div>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="py-20 px-4 relative" style={{ background: 'rgba(240,247,235,0.85)', zIndex: 2 }}>
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Book a Free Consultation</h2>
            <p className="text-gray-600">Tell us about your property and we'll get back to you within 24 hours.</p>
          </motion.div>
          
          <BookingForm />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 relative" style={{ background: 'rgba(255,255,255,0.85)', zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600">Ready for a beautiful lawn? Contact us today.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: Phone, label: 'Phone', value: '(904) 555-0123' },
                { icon: Mail, label: 'Email', value: 'makersmarg79@gmail.com' },
                { icon: MapPin, label: 'Location', value: 'Jacksonville, FL' },
                { icon: Clock, label: 'Hours', value: 'Mon-Sat: 8AM - 6PM' }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  className="flex items-center gap-4"
                  variants={slideInLeft}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360, backgroundColor: '#32782d' }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-emerald-900">{item.label}</p>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0a501a 0%, #32782d 50%, #1a581c 100%)' }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(10,80,26,0.4)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <Calendar className="w-12 h-12 text-emerald-300 mb-4" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Book Your Free Estimate</h3>
                <p className="text-emerald-100 mb-6">Same-day appointments available. No obligation, just expert advice for your lawn.</p>
                
                <div className="space-y-3 mb-6">
                  {['✓ Free property assessment', '✓ Custom quote in 24hrs', '✓ Flexible scheduling'].map((item, i) => (
                    <motion.p 
                      key={i}
                      className="text-white/90 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {item}
                    </motion.p>
                  ))}
                </div>
                
                <motion.button 
                  className="w-full bg-white text-emerald-800 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('book')}
                >
                  Schedule Now →
                </motion.button>
                
                <p className="text-emerald-200 text-xs text-center mt-4">Or call us at (904) 555-0123</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Footer */}
      <footer className="bg-emerald-950 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold">Emeralds Cuts</span>
          </motion.div>
          <p className="text-emerald-400 text-sm">© 2026 Emeralds Cuts. All rights reserved.</p>
          <motion.a 
            href="/admin.html" 
            className="text-emerald-400 hover:text-white text-sm"
            whileHover={{ scale: 1.1 }}
          >
            Admin Login
          </motion.a>
        </div>
      </footer>
    </div>
  )
}

export default App
