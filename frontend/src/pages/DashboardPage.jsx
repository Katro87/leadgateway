import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Users, MessageSquare, Clock, Plus, Send, Loader2, User, Maximize2, X } from 'lucide-react'

function DashboardPage() {
  const [stats, setStats] = useState({ totalCalls: 0, contacts: 0, messages: 0, talkTime: '0h 0m' })
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const [loading, setLoading] = useState(true)
  const [callFilter, setCallFilter] = useState('today')
  const [recentCalls, setRecentCalls] = useState([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('user') || '{}'));
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('https://api.leadgateway.tech/api/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`https://api.leadgateway.tech/api/stats/calls?range=today`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([statsData, callsData]) => {
      setStats(statsData);
      setRecentCalls(callsData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleFilterChange = async (range) => {
    setCallFilter(range);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://api.leadgateway.tech/api/stats/calls?range=${range}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setRecentCalls(data);
    } catch (err) { console.error(err); }
  };

  const statsCards = [
    { title: 'Total Calls', value: stats.totalCalls, icon: Phone, color: 'text-blue-400' },
    { title: 'Contacts', value: stats.contacts, icon: Users, color: 'text-green-400' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-purple-400' },
    { title: 'Talk Time', value: stats.talkTime, icon: Clock, color: 'text-yellow-400' },
  ];

  const filters = [
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMins = Math.floor((now - date) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="space-y-8">
      {lightboxOpen && userData.avatar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"><X size={28} /></button>
          <img src={userData.avatar} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0 cursor-pointer group relative" onClick={() => userData.avatar && setLightboxOpen(true)}>
          {userData.avatar ? (
            <>
              <img src={userData.avatar} alt="" className="w-14 h-14 object-cover object-center" />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <User size={28} className="text-white" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {userData.name || 'User'}. Here&apos;s your overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors">
              <Icon size={24} className={stat.color} />
              <p className="text-2xl font-bold text-white mt-2">{loading ? '—' : stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/dialer')} className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"><Phone size={16} /> New Call</button>
          <button onClick={() => navigate('/contacts')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"><Plus size={16} /> Add Contact</button>
          <button onClick={() => navigate('/dialer?tab=messages')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"><Send size={16} /> Send Message</button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Recent Calls</h3>
          <div className="flex gap-1">
            {filters.map(f => (
              <button key={f.value} onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${callFilter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>{f.label}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-blue-400" /></div>
        ) : recentCalls.length > 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                  <th className="px-5 py-3 font-medium">Number</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Duration</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr key={call._id} className="border-b border-gray-700/50">
                    <td className="px-5 py-4 text-sm text-white">{call.number}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${call.status === 'Connected' ? 'bg-green-500/20 text-green-400' : call.status === 'Voicemail' ? 'bg-yellow-500/20 text-yellow-400' : call.status === 'Calling' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>{call.status}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{call.duration}s</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{formatTimeAgo(call.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center text-gray-500">No calls in this period</div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage