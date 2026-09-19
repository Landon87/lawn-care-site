import { useState, useEffect } from 'react'
import { LogIn, LogOut, Users, Calendar, DollarSign, TrendingUp, CheckCircle, Clock, Phone, MapPin, Mail } from 'lucide-react'

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, scheduled: 0 })

  useEffect(() => {
    if (isLoggedIn) {
      const data = JSON.parse(localStorage.getItem('bookingSubmissions') || '[]')
      setSubmissions(data)
      setStats({
        total: data.length,
        new: data.filter(s => s.status === 'new').length,
        contacted: data.filter(s => s.status === 'contacted').length,
        scheduled: data.filter(s => s.status === 'scheduled').length
      })
    }
  }, [isLoggedIn])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const updateStatus = (id, newStatus) => {
    const updated = submissions.map(s => s.id === id ? { ...s, status: newStatus } : s)
    setSubmissions(updated)
    localStorage.setItem('bookingSubmissions', JSON.stringify(updated))
    setStats({
      total: updated.length,
      new: updated.filter(s => s.status === 'new').length,
      contacted: updated.filter(s => s.status === 'contacted').length,
      scheduled: updated.filter(s => s.status === 'scheduled').length
    })
  }

  const deleteSubmission = (id) => {
    if (!confirm('Delete this lead?')) return
    const updated = submissions.filter(s => s.id !== id)
    setSubmissions(updated)
    localStorage.setItem('bookingSubmissions', JSON.stringify(updated))
    setStats({
      total: updated.length,
      new: updated.filter(s => s.status === 'new').length,
      contacted: updated.filter(s => s.status === 'contacted').length,
      scheduled: updated.filter(s => s.status === 'scheduled').length
    })
  }

  const exportCSV = () => {
    if (submissions.length === 0) return alert('No leads to export')
    const headers = ['Name', 'Phone', 'Email', 'Preferred Date', 'Property Type', 'Location', 'Consultation', 'Maintenance', 'Notes', 'Status', 'Submitted']
    const rows = submissions.map(s => [
      s.name, s.phone, s.email || '', s.preferredDate || '', s.propertyType || '', s.location || '', s.consultation || '', s.maintenance ? 'Yes' : 'No', s.notes || '', s.status || 'new', s.date
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'emeralds-cuts-leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold text-emerald-900">Emeralds Cuts</h1>
            <p className="text-gray-500">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </form>
          <a href="/" className="block text-center text-emerald-600 mt-4 hover:underline">
            ← Back to Website
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="font-bold text-emerald-900">Emeralds Cuts</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Leads', value: stats.total, icon: Users, color: 'bg-blue-500' },
            { label: 'New', value: stats.new, icon: Clock, color: 'bg-amber-500' },
            { label: 'Contacted', value: stats.contacted, icon: Phone, color: 'bg-blue-500' },
            { label: 'Scheduled', value: stats.scheduled, icon: CheckCircle, color: 'bg-emerald-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Preferred Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">No leads yet. Submissions will appear here.</td>
                  </tr>
                ) : (
                  [...submissions].reverse().map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50">
                      <td className="py-3 px-4 font-medium">{lead.name}</td>
                      <td className="py-3 px-4 text-sm">{lead.phone}</td>
                      <td className="py-3 px-4 text-sm">{lead.email || '-'}</td>
                      <td className="py-3 px-4 text-sm font-medium text-emerald-700">{lead.preferredDate || '-'}</td>
                      <td className="py-3 px-4 text-sm capitalize">{lead.location?.replace(/-/g, ' ') || '-'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status || 'new'}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${
                            lead.status === 'scheduled' ? 'bg-emerald-100 text-emerald-700' :
                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => deleteSubmission(lead.id)} className="text-red-500 hover:text-red-600 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Calendly</h3>
            <p className="text-gray-500 text-sm mb-4">Manage your booking calendar and availability.</p>
            <a 
              href="https://calendly.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline text-sm font-medium"
            >
              Open Calendly →
            </a>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Export Data</h3>
            <p className="text-gray-500 text-sm mb-4">Download all leads as a CSV file.</p>
            <button onClick={exportCSV} className="text-emerald-600 hover:underline text-sm font-medium">
              Download CSV →
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-500 text-sm mb-4">Update services, pricing, and business info.</p>
            <button className="text-emerald-600 hover:underline text-sm font-medium">
              Open Settings →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin
