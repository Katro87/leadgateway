# LeadGateway API Documentation

**Base URL:** `https://api.leadgateway.tech/api`

---

## Authentication

### POST /users/signup
Create a new account.

**Body:** `{ "name": "string", "email": "string", "password": "string" }`
**Response:** `{ "_id", "name", "email", "token" }`

### POST /users/login
Login to existing account.

**Body:** `{ "email": "string", "password": "string" }`
**Response:** `{ "_id", "name", "email", "token" }`

### GET /users/profile
Get current user profile. **Requires Auth.**

**Headers:** `Authorization: Bearer <token>`
**Response:** `{ "_id", "name", "email" }`

### PUT /users/profile
Update profile. **Requires Auth.**

**Body:** `{ "name": "string", "email": "string", "password": "string" }` (all optional)
**Response:** `{ "_id", "name", "email" }`

### POST /users/forgot-password
Request password reset.

**Body:** `{ "email": "string" }`
**Response:** `{ "message", "resetUrl" }`

### POST /users/reset-password/:token
Reset password with token.

**Body:** `{ "password": "string" }`
**Response:** `{ "message" }`

---

## Contacts

All contact routes **require Auth** (`Authorization: Bearer <token>`).

### GET /contacts
Get all contacts for current user.

**Response:** Array of contacts.

### POST /contacts
Create a contact.

**Body:** `{ "name", "company", "email", "phone", "tags", "notes" }`
**Response:** Created contact object.

### GET /contacts/:id
Get single contact.

### PUT /contacts/:id
Update contact.

**Body:** Any fields to update.

### DELETE /contacts/:id
Delete contact.

### PUT /contacts/:id/favorite
Toggle favorite status.

---

## Messages

All message routes **require Auth**.

### GET /messages/conversations
Get all conversations (one per contact).

### GET /messages/:contactId
Get messages with a specific contact.

### POST /messages
Send a message.

**Body:** `{ "recipientId": "contact_id", "text": "string" }`

---

## Stats

### GET /stats
Get dashboard stats. **Requires Auth.**

**Response:** `{ "totalCalls", "contacts", "messages", "talkTime" }`

---

## Health

### GET /health
Server health check. No auth required.

**Response:** `{ "status": "ok" }`