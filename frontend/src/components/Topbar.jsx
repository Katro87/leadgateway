import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Sun, Moon, LogOut, ChevronDown, X } from 'lucide-react';
import { getNotifications, markAllRead } from '../api/notifications';

function Topbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      if (stored.avatar !== user.avatar) setUser(stored);
    };
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTimeout(() => navigate('/'), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/contacts?search=${encodeURIComponent(search.trim())}`);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

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
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="text-gray-400 hover:text-white transition-colors relative cursor-pointer" title="Notifications">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className={`px-4 py-3 border-b border-gray-700/50 hover:bg-gray-750 transition-colors ${!n.read ? 'bg-gray-700/30' : ''}`}>
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-white font-medium">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer" title="Account menu">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-600">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 object-cover" />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-1 z-50">
              <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
                <User size={16} /> Profile
              </button>
              <button onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <hr className="border-gray-700 my-1" />
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar