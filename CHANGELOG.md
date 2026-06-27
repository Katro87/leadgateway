# Changelog
### v0.20.0 - Error Handling & Rate Limiting ✅
- Global API error handler with auto-redirect on session expiry
- Centralized API fetch function (apiFetch)
- Rate limiting: 100 requests per 15 minutes per IP
- Proper error messages for all API failures

### v0.19.0 - UI Improvements ✅
- Show/hide password toggle on Login and Signup pages
- Export contacts to CSV file

### v0.18.0 - Live Messaging ✅
- Message model with sender, recipient, text, direction
- API: get conversations, get messages per contact, send message
- Messages page shows contact list from real contacts
- Click contact opens chat with message history
- Send message updates in real time

### v0.17.0 - Live Dashboard Stats ✅
- Dashboard fetches real stats from API
- Contact count shows actual number from database
- Welcome message shows user's actual name
- Quick action buttons navigate to correct pages

### v0.16.0 - Settings Save ✅
- Profile tab saves name and email to API
- Password tab updates password via API
- Added updateProfile endpoint to backend
- Success/error messages for form submissions

### v0.15.0 - Edit Contact ✅
- Edit Contact modal with all fields (name, company, email, phone, tags, notes)
- Pre-fills form with existing contact data
- Updates contact via API and refreshes view
- Notes field added to contact model and UI

### v0.14.0 - Add Contact Form ✅
- Add Contact modal with form (name, company, email, phone, tags)
- Tags entered as comma-separated values
- Form validation (name required)
- New contact saved to MongoDB via API
- Contact list refreshes after adding

### v0.13.0 - Contacts CRUD with Real API ✅
- Created Contact model with MongoDB (user, name, company, email, phone, tags, favorite, notes)
- Built contact API routes: GET all, GET by ID, POST create, PUT update, DELETE
- Toggle favorite endpoint
- All contacts scoped to authenticated user
- Frontend Contacts page fetches from live API
- Contact Detail page loads real data
- Favorite toggle works with API
- Delete contact with confirmation dialog
- Added localhost to CORS for development

### v0.12.0 - Forgot Password API ✅
- Forgot password endpoint generates reset token
- Reset password endpoint verifies token and updates password
- Token expires after 1 hour
- Frontend pages for forgot and reset password created
- Email integration pending (SendGrid)

### v0.11.0 - Backend Deployed to Production ✅
- Deployed backend to DigitalOcean (206.189.85.232)
- Installed Node.js, PM2, Nginx on server
- Configured api.leadgateway.tech subdomain with DNS
- Set up HTTPS with Let's Encrypt
- Nginx reverse proxy to Express API
- CORS configured for leadgateway.tech
- MongoDB Atlas whitelisted for server IP (0.0.0.0/0)
- PM2 auto-restart on server reboot
- Frontend connected to live API
- Full login/signup working in production

### v0.10.0 - Auth Protection & User Display ✅
- Added ProtectedRoute component — redirects to login if no token
- All dashboard routes now require authentication
- Topbar shows logged-in user's name and initials
- Logout button clears session and redirects to login
- Built and deployed to leadgateway.tech

### v0.9.0 - Frontend-Backend Connection ✅
- Created API helper (frontend/src/api/auth.js)
- Signup page connected to backend API with form state, loading, error handling
- Login page connected to backend API
- Token stored in localStorage after authentication
- Successful auth redirects to dashboard
- Error messages displayed for invalid credentials

### v0.8.0 - Backend Setup ✅
- Initialized Node.js + Express backend in `/backend`
- Installed express@4, mongoose, cors, dotenv, bcryptjs@2.4.3, jsonwebtoken
- Connected to MongoDB Atlas (free M0 cluster)
- Created User model with password hashing
- Built auth routes: POST /signup, POST /login, GET /profile
- JWT token generation (30-day expiry)
- Fixed Mongoose pre-save hook (bcryptjs v3 incompatibility)
- All endpoints tested and working

## v0.0.1 - Project Setup
- Created Vite + React project in `frontend/`
- Installed Tailwind CSS with Vite plugin
- Installed React Router DOM
- Configured dark theme (gray-900 background)
- Created README.md with setup instructions
- Created root folder structure (frontend, backend, docs)

## v0.0.2 - Landing Page
- Built full Landing Page UI with header, hero, features, footer
- Added working Login/Signup navigation buttons
- Features section with 3 cards (Dialer, SMS, Analytics)

## v0.0.3 - Authentication Pages
- Built Login Page (split layout: branding + form)
- Built Signup Page (name, email, password fields)
- Built Forgot Password Page
- All auth pages link to each other

## v0.0.4 - Dashboard Layout
- Created DashboardLayout with Sidebar + Topbar
- Built Sidebar with 7 navigation links + active highlighting
- Built Topbar with search, notifications bell, profile button

## v0.0.5 - Dashboard Content
- Stats cards (Total Calls, Contacts, Messages, Talk Time)
- Quick Actions section (New Call, Add Contact, Send Message)
- Recent Calls table with status badges
- Created dashboard dummy data file

## v0.0.6 - Contacts Page
- Full contacts table (name, company, email, phone, tags)
- Search functionality (name, company, email)
- Tag filter buttons (Lead, Client, Prospect, VIP)
- Favorite toggle (star/unstar)
- Placeholder pages for all sidebar routes

## v0.0.7 - Contact Detail
- Contact detail page with full info display
- Avatar with initials, all contact fields
- Edit and Delete buttons (placeholders)
- Notes section
- Clickable contact rows → detail page

## v0.0.8 - Dialer, Call History, Voicemail
- Dial pad with full keypad (0-9, *, #), number display, delete
- Call/Hang Up with Mute/Hold controls + timer
- Call History with 8 records, search + type filters
- Voicemail with play/download/delete buttons, unread indicators

## v0.0.9 - Messages/SMS
- Conversation list with avatars, last message preview
- Chat view with sent/received message bubbles
- Message input with Send button
- Unread count badges

## v0.0.10 - Settings & 404
- Settings page with 5 tabs (Profile, Password, Notifications, Integrations, Billing)
- Toggle switches for notification preferences
- Integrations placeholders (Twilio, Google Calendar, Slack, Zapier)
- 404 Not Found page for unknown routes

---

## Project Status: Frontend Complete ✅

All pages built with dark theme, responsive design, and dummy data.
Ready for Phase 7: MongoDB + Authentication integration.