import { Link } from 'react-router-dom'
import { Phone, MessageSquare, BarChart3, ArrowRight, Zap } from 'lucide-react'

function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight">LeadGateway</h1>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Log In
          </Link>
          <Link to="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Sign Up
          </Link>
        </nav>
      </header>

      <section className="flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          Outbound Calling Platform for Modern Sales Teams
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl">
          Make calls, send messages, and manage contacts — all from one powerful
          dashboard. Built for US-based sales and appointment setting.
        </p>
        <div className="flex gap-4">
          <Link to="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center gap-2">
            <Zap size={20} /> Get Started Free
          </Link>
          <Link to="/login"
            className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center gap-2">
            View Demo <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="px-8 py-20 border-t border-gray-800">
        <h3 className="text-3xl font-bold text-center mb-14">
          Everything you need to scale outbound
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-7 hover:border-gray-500 border border-gray-700 transition-colors">
            <Phone size={28} className="text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-3">Power Dialer</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Click-to-call, dial pad, and call controls. Connect with leads faster
              and track every conversation.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-7 hover:border-gray-500 border border-gray-700 transition-colors">
            <MessageSquare size={28} className="text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-3">SMS Messaging</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Send and receive text messages directly from the platform. Keep all
              conversations in one place.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-7 hover:border-gray-500 border border-gray-700 transition-colors">
            <BarChart3 size={28} className="text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-3">Call Analytics</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track call duration, outcomes, and team performance with detailed
              reports and insights.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 px-8 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 LeadGateway. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage