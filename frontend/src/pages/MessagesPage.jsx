import { useState, useEffect } from 'react'
import { getContacts } from '../api/contacts'

function MessagesPage() {
  const [contacts, setContacts] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    getContacts().then(setContacts).catch(console.error);
  }, []);

  const loadMessages = async (contactId) => {
    try {
      const res = await fetch(`https://api.leadgateway.tech/api/messages/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedChat(contact);
    loadMessages(contact._id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await fetch('https://api.leadgateway.tech/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: selectedChat._id, text: newMessage }),
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
          <button onClick={() => setSelectedChat(null)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">← Back</button>
          <div>
            <p className="font-medium text-sm">{selectedChat.name}</p>
            <p className="text-xs text-gray-400">{selectedChat.phone}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-xl text-sm ${msg.direction === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p>{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{msg.time}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-gray-500 text-sm">No messages yet. Send one!</p>}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-gray-700">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Send</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-gray-400 text-sm mt-1">{contacts.length} contacts</p>
      </div>

      <div className="space-y-1">
        {contacts.map((contact) => (
          <button key={contact._id} onClick={() => handleSelectContact(contact)}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer text-left">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
              {contact.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{contact.name}</p>
              <p className="text-sm text-gray-400 truncate mt-0.5">{contact.phone}</p>
            </div>
          </button>
        ))}
        {contacts.length === 0 && <p className="text-center text-gray-500 py-8">No contacts to message</p>}
      </div>
    </div>
  )
}

export default MessagesPage