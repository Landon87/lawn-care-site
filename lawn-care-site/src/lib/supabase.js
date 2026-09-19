import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktjyjgroqdfwztpyruve.supabase.co'
// Use the anon key from env, fallback for build time
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0anlqZ3JvcWRmd3p0cHlydXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODgxMTcsImV4cCI6MjEwNTE2NDExN30.25nGp6kmnlZYtTP0kcBT66fZ4NjGh2OL3dB4Bdv90MQ'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

// Bookings
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email || null,
      preferred_date: bookingData.preferredDate || null,
      property_type: bookingData.propertyType,
      location: bookingData.location,
      consultation: bookingData.consultation,
      maintenance: bookingData.maintenance || false,
      notes: bookingData.notes || null,
      status: 'new',
      source: 'website'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getBookings(filters = {}) {
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBooking(id) {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw error
}

// Customers
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('last_contact_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Stats
export async function getDashboardStats() {
  const { data: bookings, error } = await supabase.from('bookings').select('status, created_at')
  if (error) throw error

  const now = new Date()
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

  const total = bookings.length
  const newLeads = bookings.filter(b => b.status === 'new').length
  const thisWeek = bookings.filter(b => new Date(b.created_at) >= oneWeekAgo).length
  const completed = bookings.filter(b => b.status === 'completed').length
  const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, newLeads, thisWeek, conversionRate }
}

// Settings
export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single()
  if (error) throw error
  return data
}

export async function updateSettings(settings) {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data
}

// Pricing
export async function getPricing() {
  const { data, error } = await supabase.from('pricing').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function updatePricingItem(id, updates) {
  const { data, error } = await supabase
    .from('pricing')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createPricingItem(item) {
  const { data, error } = await supabase
    .from('pricing')
    .insert([item])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePricingItem(id) {
  const { error } = await supabase.from('pricing').delete().eq('id', id)
  if (error) throw error
}
