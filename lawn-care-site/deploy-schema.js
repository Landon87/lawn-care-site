// Deploy schema to Supabase using supabase-js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://ktjyjgroqdfwztpyruve.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0anlqZ3JvcWRmd3p0cHlydXZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTU4ODExNywiZXhwIjoyMTA1MTY0MTE3fQ.mYob2Vyx5pW5WeVZUA4V5LGbEp0xXjFAC0LMGgtDinQ'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

const schema = fs.readFileSync('./supabase-schema.sql', 'utf8')

// Split schema into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .map(s => s + ';')

console.log(`Deploying ${statements.length} SQL statements...`)

async function deploy() {
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const short = stmt.substring(0, 60).replace(/\n/g, ' ')
    process.stdout.write(`[${i + 1}/${statements.length}] ${short}... `)
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: stmt })
      if (error) {
        // Try alternative: use the sql endpoint
        const { error: err2 } = await supabase.rpc('pgql', { query: stmt })
        if (err2) {
          console.log(`SKIP (may already exist): ${error.message}`)
        } else {
          console.log('OK')
        }
      } else {
        console.log('OK')
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`)
    }
  }
  console.log('\nDone!')
}

deploy()
