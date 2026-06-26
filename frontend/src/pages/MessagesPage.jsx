import { useState } from 'react'
import { conversations, messages } from '../data/messagesData'

function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  const activeMessages = selectedChat ? messages[selectedChat] || [] : []

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    // In future: send to backend, add to messages array
    setNewMessage('')
  }

  if (selectedChat) {
    const chat = conversations.find((c) => c.id === selectedChat)
    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
          <button
            onClick={() => setSelectedChat(null)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div>
            <p className="font-medium text-sm">{chat.name}</p>
            <p className="text-xs text-gray-400">{chat.number}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-gray-700">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    )
  }

  // Conversation List
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-gray-400 text-sm mt-1">{conversations.length} conversations</p>
      </div>

      <div className="space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedChat(conv.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer text-left"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
              {conv.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">{conv.name}</p>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
            </div>

            {/* Unread Badge */}
            {conv.unread > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {conv.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MessagesPage