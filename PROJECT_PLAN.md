# LeadGateway - Project Development Guide

## Project Overview

We are building a professional browser-based outbound calling platform called **LeadGateway**.

Domain:
**leadgateway.tech**

The application is intended for US outbound sales, appointment setting, lead generation, and business communications.

The goal is to create a web application similar in concept to Dialpad, OpenPhone, Aircall, or JustCall, but focused on my own business.

The application must be modern, scalable, responsive, and easy to expand.

This is a long-term project.

Do not rush development.

---

# Development Rules

You are my senior software engineer.

Follow these rules at all times.

1. Never generate the entire project at once.

2. Build only one milestone at a time.

3. Wait until I confirm that the current milestone works before moving to the next one.

4. Keep the code clean and modular.

5. Every file should have a clear purpose.

6. Explain every folder you create.

7. Explain every dependency before installing it.

8. Never rewrite existing working code unless necessary.

9. If improvements are needed, explain why first.

10. Keep scalability in mind for future features.

---

# Tech Stack

Frontend

* React
* Vite
* Tailwind CSS

Backend

* Node.js
* Express

Database

* MongoDB Atlas (later)

Authentication

* MongoDB (later)

Voice

* Twilio Voice SDK (later)

Messaging

* Twilio Messaging (later)

Hosting

Frontend:
GitHub Pages

Backend:
DigitalOcean, Railway, Render, or another Node.js host.

---

# Current Goal

DO NOT integrate Twilio yet.

DO NOT integrate MongoDB yet.

DO NOT integrate authentication yet.

The objective is to build a fully working frontend before connecting backend services.

---

# Project Structure

The application should eventually contain:

Landing Page

Login

Signup

Dashboard

Sidebar

Dial Pad

Contacts

Contact Details

SMS

Conversation List

Call History

Voicemail

Settings

Profile

Notifications

Search

Admin Panel (future)

Analytics (future)

Campaigns (future)

---

# UI Design

Requirements

Modern

Professional

Dark Theme

Responsive

Minimal

Fast

Looks like commercial SaaS software.

Avoid unnecessary animations.

Everything should feel clean.

---

# Dashboard

The dashboard should eventually include:

Sidebar

Top Navigation

Search

Quick Actions

Recent Calls

Favorites

Dial Pad

Recent Messages

Statistics Cards

Activity Feed

Everything should be modular.

---

# Contacts

Features planned

Add Contact

Edit Contact

Delete Contact

Favorite Contact

Tags

Search

Company

Email

Phone Numbers

Notes

---

# Dialer

Future Features

Dial Pad

Keyboard Input

Call Button

Hang Up

Mute

Hold

Transfer

Recent Calls

Call Timer

Call Status

Incoming Calls

Outgoing Calls

Twilio integration later.

Initially the buttons may be placeholders.

---

# SMS

Future Features

Conversation List

Compose Message

Send Button

Search

Unread Badge

Message History

Twilio integration later.

---

# Call History

Future Features

Contact Name

Phone Number

Duration

Result

Date

Search

Filters

Export

Initially use dummy data.

---

# Voicemail

Future Features

Voicemail List

Playback

Download

Delete

Timestamp

Twilio integration later.

---

# Settings

Theme

Profile

Password

Notifications

Twilio Settings

API Keys

Integrations

Billing

Future expansion.

---

# Development Order

Phase 1

Create project

Folder structure

Navigation

Theme

Landing page

Phase 2

Login UI

Signup UI

Forgot Password UI

Dashboard Layout

Sidebar

Topbar

Phase 3

Contacts UI

Contact Detail UI

Search

Filters

Dummy data

Phase 4

Dial Pad UI

Recent Calls UI

Call Screen UI

Dummy functionality

Phase 5

SMS UI

Conversation UI

Compose UI

Dummy messages

Phase 6

Call History

Voicemail

Settings

Profile

Everything should still function without a backend.

---

# Future Integrations

After the frontend is complete we will integrate one service at a time.

Order

1. MongoDB

2. Authentication

3. API

4. Twilio

5. Voice

6. SMS

7. Call Logs

8. Voicemail

9. File Uploads

10. Analytics

Do not skip this order.

---

# Important Instruction

After every completed milestone stop and wait for my approval.

Do not continue automatically.

I want to review every stage before moving forward.

Always provide complete file paths, explain where every file belongs, explain how to run the project, and list exactly which files were added or modified.
