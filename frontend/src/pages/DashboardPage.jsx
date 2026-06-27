import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Users, MessageSquare, Clock, Plus, Send } from 'lucide-react'

function DashboardPage() {
  const [stats, setStats] = useState({ totalCalls: 0, contacts: 0, messages: 0, talkTime: '0h 0m' })
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || 'User');

    const token = localStorage.getItem('token');
    fetch('https://api.leadgateway.tech/api/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statsCards = [
    { title: 'Total Calls', value: stats.totalCalls, icon: Phone, color: 'text-blue-400' },
    { title: 'Contacts', value: stats.contacts, icon: Users, color: 'text-green-400' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-purple-400' },
    { title: 'Talk Time', value: stats.talkTime, icon: Clock, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, {userName}. Here&apos;s your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors">
              <Icon size={24} className={stat.color} />
              <p className="text-2xl font-bold text-white mt-2">
                {loading ? '—' : stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/dialer')}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Phone size={16} /> New Call
          </button>
          <button onClick={() => navigate('/contacts')}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Plus size={16} /> Add Contact
          </button>
          <button onClick={() => navigate('/messages')}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Send size={16} /> Send Message
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <p className="text-gray-500">Recent calls will appear here once you start making calls.</p>
      </div>
    </div>
  )
}

export default DashboardPage