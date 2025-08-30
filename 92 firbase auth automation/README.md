# Firebase Automation Platform

A comprehensive platform for programmatically creating and configuring Firebase projects using Google OAuth and Firebase Management REST API.

## Features

- 🔐 Google OAuth 2.0 Authentication
- 🚀 Automated Firebase Project Creation
- 📊 Real-time Database Setup
- 🔥 Firestore Rules Configuration
- ⚡ React Frontend with Modern UI
- 🖥️ Node.js Backend with Express
- 🛡️ Comprehensive Error Handling

## Architecture

```
firebase-automation-platform/
├── frontend/          # React application
├── backend/           # Node.js Express server
└── docs/             # Documentation
```

## Prerequisites

1. Google Cloud Console project with enabled APIs:
   - Firebase Management API
   - Cloud Resource Manager API
   - Service Usage API

2. OAuth 2.0 credentials (Web application)

3. Node.js 18+ and npm

## Setup

1. Clone the repository
2. Run `npm run install:all` to install all dependencies
3. Configure environment variables (see backend/.env.example)
4. Run `npm run dev` to start both frontend and backend

## Environment Variables

See `backend/.env.example` for required configuration.

## APIs Used

- Firebase Management API v1beta1
- Google Cloud Resource Manager API
- Firebase Realtime Database API
- Cloud Firestore API

## Security Considerations

- All sensitive operations require user authentication
- Server-side OAuth token validation
- Rate limiting and request validation
- Secure credential management