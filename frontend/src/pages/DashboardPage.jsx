import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const [stats, setStats] = useState({ totalCalls: 0, contacts: 0, messages: 0, talkTime: '0h 0m' })
  const [userName, setUserName] = useState('')
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
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const statsCards = [
    { title: 'Total Calls', value: stats.totalCalls, icon: '📞' },
    { title: 'Contacts', value: stats.contacts, icon: '👤' },
    { title: 'Messages', value: stats.messages, icon: '💬' },
    { title: 'Talk Time', value: stats.talkTime, icon: '⏱️' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, {userName}. Here&apos;s your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.title} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/dialer')} className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            📞 New Call
          </button>
          <button onClick={() => navigate('/contacts')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            👤 Add Contact
          </button>
          <button onClick={() => navigate('/messages')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            💬 Send Message
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