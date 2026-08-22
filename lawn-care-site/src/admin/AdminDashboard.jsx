import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Calendar, DollarSign, TrendingUp, 
  MessageSquare, Settings, LogOut, Menu, X,
  ChevronRight, Phone, Mail, MapPin, Clock
} from 'lucide-react'

// Mock data - in production this would come from a backend
const mockSubmissions = [
  {
    id: 1,
    name: 'John Smith',
    phone: '(904) 555-0101',
    email: 'john@email.com',
    propertyType: 'residential',
    location: 'jacksonville',
    consultation: 'in-person',
    maintenance: true,
    notes: 'Need weekly mowing service',
    date: '2026-08-22',
    status: 'new'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    phone: '(904) 555-0102',
    email: '',
    propertyType: 'commercial',
    location: 'macclenny',
    consultation: 'phone',
    maintenance: false,
    notes: 'Office building landscaping',
    date: '2026-08-21',
    status: 'contacted'
  },
  {
    id: 3,
    name: 'Mike Davis',
    phone: '(904) 555-0103',
    email: 'mike@email.com',
    propertyType: 'residential',
    location: 'st-augustine',
    consultation: 'in-person',
    maintenance: true,
    notes: 'Full yard renovation needed',
    date: '2026-08-20',
    status: 'scheduled'
  }
]

const mockAnalytics = {
  totalSubmissions: 24,
  thisWeek: 5,
  conversionRate: '68%',
  avgResponseTime: '2.3 hrs'
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'submissions', label: 'Form Submissions', icon: MessageSquare },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleStatusChange = (id, newStatus) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ))
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside 
        className={`bg-emerald-900 text-white fixed h-full z-50 ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 64 }}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1 
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Emeralds Cuts
            </motion.h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-800 transition ${
                activeTab === item.id ? 'bg-emerald-800 border-r-4 border-emerald-400' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button className="flex items-center gap-3 text-emerald-300 hover:text-white transition">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Submissions', value: mockAnalytics.totalSubmissions, icon: MessageSquare, color: 'bg-blue-500' },
                    { label: 'This Week', value: mockAnalytics.thisWeek, icon: Calendar, color: 'bg-green-500' },
                    { label: 'Conversion Rate', value: mockAnalytics.conversionRate, icon: TrendingUp, color: 'bg-purple-500' },
                    { label: 'Avg Response', value: mockAnalytics.avgResponseTime, icon: Clock, color: 'bg-orange-500' }
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="bg-white rounded-xl shadow-sm p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Submissions</h3>
                    <button 
                      onClick={() => setActiveTab('submissions')}
                      className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.slice(0, 5).map((sub) => (
                          <tr key={sub.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{sub.name}</td>
                            <td className="py-3 px-4">{sub.phone}</td>
                            <td className="py-3 px-4 capitalize">{sub.propertyType}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">{sub.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">All Form Submissions</h3>
                    <div className="flex gap-2">
                      <select className="border rounded-lg px-3 py-2 text-sm">
                        <option>All Status</option>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Scheduled</option>
                        <option>Completed</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Search..."
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((sub) => (
                          <tr key={sub.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{sub.name}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1 text-sm">
                                  <Phone className="w-3 h-3" /> {sub.phone}
                                </span>
                                {sub.email && (
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Mail className="w-3 h-3" /> {sub.email}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 capitalize">{sub.location.replace('-', ' ')}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span className="capitalize">{sub.propertyType}</span>
                                <span className="text-xs text-gray-500">{sub.consultation}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <select 
                                value={sub.status}
                                onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(sub.status)}`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">{sub.date}</td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => setSelectedSubmission(sub)}
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submission Detail Modal */}
                <AnimatePresence>
                  {selectedSubmission && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                      onClick={() => setSelectedSubmission(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">Submission Details</h3>
                          <button 
                            onClick={() => setSelectedSubmission(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-500">Name</label>
                              <p className="font-medium">{selectedSubmission.name}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Phone</label>
                              <p className="font-medium">{selectedSubmission.phone}</p>
                            </div>
                          </div>
                          
                          {selectedSubmission.email && (
                            <div>
                              <label className="text-sm text-gray-500">Email</label>
                              <p className="font-medium">{selectedSubmission.email}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-500">Property Type</label>
                              <p className="font-medium capitalize">{selectedSubmission.propertyType}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Location</label>
                              <p className="font-medium capitalize">{selectedSubmission.location.replace('-', ' ')}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500">Consultation Preference</label>
                            <p className="font-medium capitalize">{selectedSubmission.consultation}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500">Maintenance Interest</label>
                            <p className="font-medium">{selectedSubmission.maintenance ? 'Yes' : 'No'}</p>
                          </div>
                          
                          {selectedSubmission.notes && (
                            <div>
                              <label className="text-sm text-gray-500">Notes</label>
                              <p className="font-medium">{selectedSubmission.notes}</p>
                            </div>
                          )}
                          
                          <div className="pt-4 border-t flex gap-2">
                            <a 
                              href={`tel:${selectedSubmission.phone.replace(/\D/g, '')}`}
                              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-center hover:bg-emerald-600 transition"
                            >
                              Call Customer
                            </a>
                            {selectedSubmission.email && (
                              <a 
                                href={`mailto:${selectedSubmission.email}`}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-200 transition"
                              >
                                Email Customer
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Customer Database</h3>
                <p className="text-gray-500 mt-2">Coming soon - Customer management features</p>
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Appointment Calendar</h3>
                <p className="text-gray-500 mt-2">Coming soon - Schedule and manage appointments</p>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl"
              >
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Business Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input 
                        type="text" 
                        defaultValue="Emeralds Cuts Lawn Services"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="(904) 555-0123"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue="makersmarg79@gmail.com"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                      <input 
                        type="text" 
                        defaultValue="Mon-Sat: 8AM - 6PM"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas</label>
                      <textarea 
                        defaultValue="Jacksonville, Macclenny, St. Augustine, Yulee, Stance, Jax Beach, Middleburg"
                        className="w-full border rounded-lg px-3 py-2 h-24"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
