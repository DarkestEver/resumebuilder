# Error Code Reference

## Authentication Error Codes (401)

Backend returns structured error codes to help frontend make smart decisions about logout vs error display.

### Token Errors (Auto-logout + Token Refresh)
- `TOKEN_EXPIRED` - JWT token has expired, attempt refresh
- `TOKEN_INVALID` - JWT token is malformed or invalid
- `TOKEN_MISSING` - No authorization header provided

**Frontend Action:** Attempt token refresh. If refresh fails, logout and redirect to `/login?expired=true`

### Other 401 Errors (No Logout)
- `USER_NOT_FOUND` - User account deleted after token issued
- No code or other codes - Show error, don't auto-logout

**Frontend Action:** Display error message, keep user logged in (might be API bug or data issue)

## Authorization Error Codes (403)

- `INSUFFICIENT_PERMISSIONS` - User lacks required role/permissions
- `EMAIL_NOT_VERIFIED` - Email verification required
- `SUBSCRIPTION_REQUIRED` - Feature requires paid plan
- `SUBSCRIPTION_EXPIRED` - Subscription inactive

**Frontend Action:** Display error message, keep user logged in

## Usage Example

### Backend
```typescript
// Token expired - should trigger refresh
throw new AppError('Token expired', 401, 'TOKEN_EXPIRED');

// User deleted - show error, don't refresh
throw new AppError('User not found', 401, 'USER_NOT_FOUND');

// Permission denied - show error, don't logout
throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
```

### Frontend
```typescript
// Interceptor checks error.response.data.code
if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'TOKEN_INVALID') {
  // Attempt token refresh
}
```

## Benefits

✅ **Reliable:** No string matching, works across languages/formats
✅ **Predictable:** Backend explicitly tells frontend what to do
✅ **Maintainable:** Change error messages without breaking frontend logic
✅ **Debuggable:** Clear error codes in logs and network inspector
