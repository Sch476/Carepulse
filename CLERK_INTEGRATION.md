# Clerk Authentication Integration Guide

This document explains the Clerk authentication integration for CarePulse.

## 1. Installation (Already Complete)

```bash
pnpm add @clerk/clerk-react
```

## 2. Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

Get your publishable key from [Clerk Dashboard](https://dashboard.clerk.com):
1. Create or select your application
2. Go to API Keys
3. Copy the "Publishable Key"

## 3. Clerk Dashboard Configuration

### Enable Sign-in Methods
1. Go to **Configure > Email, Phone, Username**
2. Enable your preferred authentication methods (email, Google, etc.)

### Configure URLs
1. Go to **Configure > Paths**
2. Set:
   - **Sign-in URL**: `/login`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

### Set Up Roles (Public Metadata)

To assign roles to users, use Clerk's public metadata:

**Option A: Via Clerk Dashboard**
1. Go to **Users** in Clerk Dashboard
2. Select a user
3. Scroll to **Public metadata**
4. Add:
```json
{
  "role": "hospital"
}
```
or
```json
{
  "role": "insurance"
}
```

**Option B: Via Clerk Backend API (Recommended for Production)**

Create a webhook or use Clerk's Backend SDK to set roles programmatically:

```javascript
// Example: Using Clerk Backend SDK (Node.js)
import { clerkClient } from "@clerk/clerk-sdk-node";

// After user signs up, set their role
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    role: "hospital" // or "insurance"
  }
});
```

**Option C: Custom Sign-up Flow with Role Selection**

You could create a role selection page after sign-up:

```tsx
// client/pages/SelectRole.tsx
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const { user } = useUser();
  const navigate = useNavigate();

  const selectRole = async (role: "hospital" | "insurance") => {
    await user?.update({
      unsafeMetadata: { pendingRole: role }
    });
    // You'd then have a backend webhook to move this to publicMetadata
    navigate("/dashboard");
  };

  return (
    <div>
      <button onClick={() => selectRole("hospital")}>Hospital</button>
      <button onClick={() => selectRole("insurance")}>Insurance</button>
    </div>
  );
}
```

## 4. Code Structure

### Files Modified/Created

```
client/
├── App.tsx                          # ClerkProvider wrapper, routing
├── hooks/
│   └── use-auth.tsx                 # Custom hook wrapping Clerk
├── components/
│   ├── auth/
│   │   ├── index.ts                 # Auth exports
│   │   ├── ProtectedRoute.tsx       # Route protection component
│   │   └── RoleRedirect.tsx         # Role-based redirect
│   └── layout/
│       ├── dashboard-layout.tsx     # Updated with Clerk
│       └── sidebar.tsx              # Updated with Clerk user info
└── pages/
    ├── Login.tsx                    # Clerk SignIn integration
    └── SignUp.tsx                   # Clerk SignUp integration
```

## 5. Key Components

### ClerkProvider (App.tsx)

```tsx
<ClerkProvider
  publishableKey={CLERK_PUBLISHABLE_KEY}
  routerPush={(to) => navigate(to)}
  routerReplace={(to) => navigate(to, { replace: true })}
  appearance={{
    variables: {
      colorPrimary: "hsl(222.2 47.4% 11.2%)",
    },
  }}
>
  {/* Your app */}
</ClerkProvider>
```

### ProtectedRoute Component

```tsx
import { ProtectedRoute } from "@/components/auth";

// Protect any route (requires login)
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Protect with role restriction
<Route
  path="/hospital/burnout"
  element={
    <ProtectedRoute allowedRoles={["hospital"]}>
      <Burnout />
    </ProtectedRoute>
  }
/>
```

### useAuth Hook

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isLoading, isSignedIn, logout, getRoleBasedRedirect } = useAuth();

  if (isLoading) return <Loading />;
  if (!isSignedIn) return <Redirect to="/login" />;

  return (
    <div>
      <p>Welcome, {user?.fullName}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## 6. Route Protection Summary

| Route | Protection | Allowed Roles |
|-------|-----------|---------------|
| `/` | Public | All |
| `/login` | Public | All |
| `/sign-up` | Public | All |
| `/dashboard` | Protected + Role Redirect | All authenticated |
| `/hospital/*` | Protected | `hospital` only |
| `/insurance/*` | Protected | `insurance` only |

## 7. Role-Based Redirects

After login, users are automatically redirected based on their role:

- **hospital** → `/hospital/burnout`
- **insurance** → `/insurance/medicine`
- **no role** → `/dashboard` (shows general overview)

If a user tries to access a route they don't have permission for, they're redirected to their role-appropriate dashboard.

## 8. Session Handling

### User Info Display
The sidebar and header automatically show:
- User's profile image (or initials fallback)
- Full name
- Email address
- Role-specific portal label

### Sign Out
```tsx
import { useClerk } from "@clerk/clerk-react";

const { signOut } = useClerk();

// Sign out and redirect to login
await signOut({ redirectUrl: "/login" });
```

### Loading States
All protected routes show a loading spinner while Clerk initializes.

## 9. Customizing Clerk UI

The SignIn and SignUp components use Clerk's appearance prop:

```tsx
<SignIn
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-2xl shadow-primary/10 bg-white/80 backdrop-blur-sm border-none",
      headerTitle: "text-2xl font-bold",
      formButtonPrimary: "bg-primary hover:bg-primary/90",
    },
  }}
/>
```

See [Clerk Customization Docs](https://clerk.com/docs/customization/overview) for all options.

## 10. Testing Checklist

- [ ] Users can sign up with email/password or OAuth
- [ ] Users can sign in
- [ ] Unauthenticated users are redirected to `/login`
- [ ] After login, users are redirected based on role
- [ ] Hospital users can only access `/hospital/*` routes
- [ ] Insurance users can only access `/insurance/*` routes
- [ ] Sign out works and redirects to `/login`
- [ ] User info displays correctly in sidebar/header
- [ ] Loading states appear while auth is initializing

## 11. Production Considerations

1. **Use Clerk's Production instance** - Create a separate Clerk application for production
2. **Set up webhooks** - Sync user data with your backend when users sign up/update
3. **Add error boundaries** - Handle Clerk errors gracefully
4. **Configure allowed origins** - In Clerk Dashboard > Configure > Paths > Allowed origins

## 12. Troubleshooting

**"Missing publishable key" error**
- Ensure `.env.local` has `VITE_CLERK_PUBLISHABLE_KEY`
- Restart the dev server after adding env vars

**Sign-in redirects to wrong page**
- Check `forceRedirectUrl` prop on SignIn component
- Verify Clerk Dashboard redirect URLs

**Role not working**
- Check user's publicMetadata in Clerk Dashboard
- Ensure the role value is exactly `"hospital"` or `"insurance"`

**CORS errors**
- Add your domain to Clerk Dashboard > Allowed origins
