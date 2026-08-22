import { useState } from 'react'
import { LogIn, LogOut, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Invalid password')
    }
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
            { label: 'Total Clients', value: '24', icon: Users, color: 'bg-blue-500' },
            { label: 'This Week', value: '8', icon: Calendar, color: 'bg-emerald-500' },
            { label: 'Revenue', value: '$1,240', icon: DollarSign, color: 'bg-amber-500' },
            { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
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

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { client: 'John Smith', service: 'Lawn Mowing', date: 'Aug 20, 2026', status: 'Confirmed' },
                  { client: 'Sarah Johnson', service: 'Fertilization', date: 'Aug 21, 2026', status: 'Pending' },
                  { client: 'Mike Davis', service: 'Cleanup', date: 'Aug 22, 2026', status: 'Confirmed' },
                ].map((appt, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 px-4">{appt.client}</td>
                    <td className="py-3 px-4">{appt.service}</td>
                    <td className="py-3 px-4">{appt.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appt.status === 'Confirmed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <h3 className="font-bold text-gray-900 mb-2">Client List</h3>
            <p className="text-gray-500 text-sm mb-4">View and manage your client database.</p>
            <button className="text-emerald-600 hover:underline text-sm font-medium">
              View Clients →
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
