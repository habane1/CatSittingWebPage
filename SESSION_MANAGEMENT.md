# Admin Session Management System

## Overview

The admin panel now uses a comprehensive session management system that provides enhanced security and automatic logout functionality.

## Key Features

### 1. Automatic Session Timeout
- **Session Duration**: 30 minutes of inactivity
- **Warning**: Shows 5 minutes before expiry
- **Automatic Logout**: Logs out user when session expires

### 2. Activity Detection
The system monitors user activity through:
- Mouse movements
- Keyboard input
- Scrolling
- Touch events
- Page visibility changes
- Window focus events

### 3. Dual Authentication
- **Client-side**: Session stored in localStorage with expiry
- **Server-side**: HTTP-only cookie for additional security
- **Middleware**: Server-side route protection

### 4. Session Warning System
- **Visual Timer**: Shows remaining session time in header
- **Warning Modal**: Appears 5 minutes before expiry
- **Extend Option**: Allows users to extend their session

## Security Features

### Session Expiry
- Sessions automatically expire after 30 minutes of inactivity
- Both client and server sessions are cleared on logout
- Automatic redirect to login page on session expiry

### Server-Side Protection
- Middleware protects all admin routes
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production environment

### Activity Monitoring
- Continuous monitoring of user activity
- Session extension on detected activity
- Automatic logout on inactivity

## Components

### SessionManager (`src/lib/session.ts`)
- Singleton class managing session state
- Handles session creation, validation, and cleanup
- Manages activity listeners and timers

### SessionTimer (`src/components/SessionTimer.tsx`)
- Displays remaining session time
- Shows warning indicator when time is low
- Updates in real-time

### SessionWarningModal (`src/components/SessionWarningModal.tsx`)
- Modal dialog for session expiry warnings
- Allows session extension
- Provides clear user feedback

## API Endpoints

### `/api/admin/login`
- Authenticates user with password
- Sets HTTP-only cookie
- Returns success/error response

### `/api/admin/logout`
- Clears authentication cookie
- Logs out user from server

### `/api/admin/refresh-session`
- Extends server-side session
- Updates cookie expiry time

## Usage

### For Users
1. **Login**: Enter password on admin login page
2. **Session Timer**: Monitor remaining time in header
3. **Activity**: Normal usage automatically extends session
4. **Warning**: Respond to session expiry warnings
5. **Logout**: Use logout button or wait for auto-logout

### For Developers
```typescript
import { sessionManager } from '@/lib/session';

// Check authentication
const isAuth = sessionManager.isAuthenticated();

// Get session info
const session = sessionManager.getSession();

// Manual logout
await sessionManager.logout();

// Get time until expiry
const timeLeft = sessionManager.getTimeUntilExpiry();
```

## Configuration

### Session Timeout
Default: 30 minutes (1,800,000 milliseconds)
Can be modified in `src/lib/session.ts`:

```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
```

### Warning Threshold
Default: 5 minutes before expiry
Can be modified in session checking logic.

## Security Considerations

1. **Session Storage**: Uses localStorage for client-side state
2. **Cookie Security**: HTTP-only cookies prevent XSS
3. **Automatic Cleanup**: Sessions are cleared on logout/expiry
4. **Activity Monitoring**: Prevents session hijacking
5. **Server Validation**: Middleware validates all requests

## Browser Compatibility

- Modern browsers with localStorage support
- JavaScript enabled required
- HTTPS recommended for production

## Troubleshooting

### Session Not Persisting
- Check browser localStorage support
- Verify cookie settings
- Check for JavaScript errors

### Premature Logout
- Verify activity detection is working
- Check for conflicting JavaScript
- Review browser console for errors

### Login Issues
- Verify admin password environment variable
- Check API endpoint availability
- Review server logs for errors
