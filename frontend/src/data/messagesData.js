export const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    number: '(415) 555-0123',
    lastMessage: 'Sounds great, talk tomorrow!',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: 2,
    name: 'Mike Peters',
    number: '(212) 555-0456',
    lastMessage: 'Can you send me the proposal?',
    time: '9:15 AM',
    unread: 0,
  },
  {
    id: 3,
    name: 'Emily Davis',
    number: '(310) 555-0789',
    lastMessage: 'Thanks for the follow up!',
    time: 'Yesterday',
    unread: 1,
  },
  {
    id: 4,
    name: 'James Wilson',
    number: '(512) 555-0321',
    lastMessage: 'I ll call you back later',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 5,
    name: 'Lisa Chen',
    number: '(617) 555-0654',
    lastMessage: 'Meeting confirmed for Friday',
    time: 'Jun 24',
    unread: 3,
  },
]

export const messages = {
  1: [
    { id: 1, sender: 'them', text: 'Hi! Are we still on for the demo tomorrow?', time: '10:15 AM' },
    { id: 2, sender: 'me', text: 'Yes, absolutely. 2 PM works great.', time: '10:20 AM' },
    { id: 3, sender: 'them', text: 'Perfect. I\'ll have the team ready.', time: '10:25 AM' },
    { id: 4, sender: 'me', text: 'Sounds great, talk tomorrow!', time: '10:30 AM' },
  ],
}