# PBI-3: Student Login and Welcome - Design Document

## Architecture Overview

### Current Implementation: Static Mock Authentication with NextAuth

**Architecture Flow (Current - PBI-3):**
```
Browser → Next.js (NextAuth + Static Mock) → Session Cookie
```

**How it works:**
1. Next.js uses NextAuth v5 (Auth.js) Credentials provider
2. Credentials provider validates against **static mock credentials** (hardcoded in Next.js)
3. NextAuth creates session with mock user data
4. NextAuth stores session in HTTP-only cookie
5. NextAuth middleware protects authenticated routes

**Future Migration Path:**
```
Browser → Next.js (NextAuth) → Elysia (Auth Logic) → Keycloak (Future)
```

When Elysia auth endpoint is ready, we'll:
1. Update the `authorize()` function to call Elysia API using axios
2. Elysia will validate credentials and return access token
3. All other code remains unchanged

**Why Static Mock for Now:**
- ⚠️ Elysia auth endpoint is under development
- ✅ Allows frontend development to proceed independently
- ✅ Easy migration: just swap the `authorize()` function implementation
- ✅ Same session management, routing, and UI components

## UI Design Specifications

### Design Assets
Reference designs located at: `design/pbi-3-login/`
- `login-page.png` - Main login page design
- `welcome-page.png` - Welcome/onboarding page design

---

### Welcome Page Design

**Layout:**
- Full-screen page with vertical centering
- Light background (#F5F5F5 or white)
- Content card centered with max-width
- Mobile-first, responsive design (320px minimum)

**Components:**

1. **Header**
   - Text: "Welcome"
   - Font: Bold, ~20px
   - Color: Black (#1F2937)
   - Center aligned
   - Top of page with padding

2. **Content Card**
   - White background with subtle shadow
   - Rounded corners (~16px border-radius)
   - Padding: 2.5rem
   - Max-width: 500px
   - Centered horizontally

3. **Illustration**
   - 3D isometric desk scene with computer, lamp, books, coffee
   - Centered in card
   - Aspect ratio: ~16:9 or square
   - Image file: Use illustration from design or similar asset
   - Alt text: "AI-powered learning environment"

4. **Headline**
   - Text: "AI Education, Reimagined"
   - Font: Bold, ~28px
   - Color: Black (#1F2937)
   - Center aligned
   - Margin top: 1.5rem

5. **Description**
   - Text: "Transform how you teach and learn AI with interactive tools that adapt to every classroom."
   - Font: Regular, ~16px
   - Color: Gray (#6B7280)
   - Center aligned
   - Line height: 1.6
   - Margin top: 1rem

6. **Pagination Dots**
   - 3 dots indicating carousel position
   - Active dot: Primary purple (#7C3AED)
   - Inactive dots: Light gray (#D1D5DB)
   - Size: 8px diameter
   - Spacing: 8px between dots
   - Centered horizontally
   - Position: Bottom center of card

7. **Navigation Buttons**
   - **Skip Button:**
     - Text: "Skip"
     - Style: Text button (no background)
     - Color: Gray (#6B7280)
     - Position: Bottom left
     - Font: Regular, 14px

   - **Next Button:**
     - Text: "Next"
     - Background: Primary purple (#7C3AED)
     - Text: White
     - Rounded corners (~24px for pill shape)
     - Padding: 12px 32px
     - Position: Bottom right
     - Font: Semi-bold, 14px
     - Hover: Slightly darker purple

**Carousel Behavior:**
- 3 slides total (can expand with additional content slides)
- Slide 1: AI Education, Reimagined (shown in design)
- Slide 2: (Future) Interactive Learning Blocks
- Slide 3: (Future) Track Your Progress
- Swipe gesture support on mobile (optional)
- Auto-advance on "Next" button click
- "Next" becomes "Get Started" on last slide
- Both "Skip" and "Get Started" redirect to `/login`

**Responsive Design:**
- Mobile (< 640px): Full-screen card, smaller padding
- Tablet/Desktop (≥ 640px): Centered card with max-width

---

### Login Page Design

**Layout:**
- Centered card layout on light background (`#F5F5F5` or similar)
- Mobile-first, responsive design (320px minimum)
- Vertical stack layout with consistent spacing

**Components:**

1. **Logo Section**
   - Murasaki logo: Purple square with smile icon and lightbulb
   - Centered at top of form
   - Size: ~80px × 80px
   - Margin bottom: 2rem

2. **Heading**
   - Text: "Sign in your account"
   - Font: Bold, ~24px
   - Color: Black (#000000 or near-black)
   - Center aligned
   - Margin bottom: 2rem

3. **Email Input Field**
   - Label: "Email" (above input, left-aligned)
   - Placeholder: "ex: murasaki@example.com"
   - Input type: email
   - Full width
   - Rounded corners (~8px border-radius)
   - Light border (#E0E0E0)
   - Padding: 12px 16px
   - Margin bottom: 1.5rem

4. **Password Input Field**
   - Label: "Password" (above input, left-aligned)
   - Placeholder: Masked dots (•••••••••)
   - Input type: password
   - Full width
   - Rounded corners (~8px border-radius)
   - Light border (#E0E0E0)
   - Padding: 12px 16px
   - Margin bottom: 1.5rem

5. **Sign In Button**
   - Text: "SIGN IN" (uppercase, white text)
   - Background: Primary purple (#7C3AED or similar brand color)
   - Full width
   - Rounded corners (~8px border-radius)
   - Padding: 14px
   - Font weight: Semi-bold
   - Hover state: Slightly darker purple
   - Disabled state: Opacity 0.5, cursor not-allowed
   - Loading state: Show spinner, text "Signing in..."

6. **OAuth Divider**
   - Text: "or sign in with"
   - Color: Gray (#6B7280)
   - Font size: 14px
   - Centered with decorative lines on sides
   - Margin: 1.5rem 0

7. **Microsoft OAuth Button** (Out of Scope - Non-functional)
   - White background
   - Microsoft logo (4-color square)
   - Light border
   - Full width
   - Rounded corners
   - **Note:** Displayed but non-functional for PBI-3

8. **Sign Up Link**
   - Text: "Don't have an account? **SIGN UP**"
   - "SIGN UP" text in purple, bold
   - Center aligned
   - Margin top: 2rem
   - **Note:** Link present but registration is out of scope

**Color Palette:**
- Primary Purple: `#7C3AED` (buttons, links, brand elements)
- Background: `#F5F5F5` (page background)
- Card Background: `#FFFFFF` (form container)
- Text Primary: `#1F2937` (headings, labels)
- Text Secondary: `#6B7280` (placeholders, helper text)
- Border: `#E5E7EB` (input borders)
- Error Red: `#EF4444` (error messages)

**Spacing System:**
- Container max-width: 400px
- Container padding: 2rem
- Card padding: 2.5rem
- Input spacing: 1.5rem
- Section spacing: 2rem

**Typography:**
- Font family: Inter, system-ui, sans-serif (or existing Murasaki font)
- Heading (h1): 24px, font-weight 700
- Label: 14px, font-weight 500
- Input text: 16px, font-weight 400
- Button: 14px, font-weight 600, uppercase

**Responsive Breakpoints:**
- Mobile: < 640px (card takes full width with side padding)
- Tablet/Desktop: ≥ 640px (centered card with max-width)

---

## Technical Design

### Technology Stack

**Authentication:**
- NextAuth v5 (Auth.js) - Session management
- Credentials provider - Email/password authentication
- JWT strategy - Stateless session tokens
- **Mock validation** - Static credentials (no API call for now)

**UI Components:**
- Shadcn/ui components (existing in project)
- Tailwind CSS v4 - Styling
- React Hook Form - Form management
- Zod - Form validation schema
- Embla Carousel (or similar) - Welcome page carousel

**API Communication (Future):**
- Axios from `lib/api/axios-instance.ts`
- Will be used when Elysia auth endpoint is ready

### Component Architecture

```
app/
├── (auth)/                          # Auth route group (no navbar/footer)
│   ├── welcome/
│   │   └── page.tsx                 # Welcome onboarding page
│   └── login/
│       └── page.tsx                 # Login page (Server Component)
│
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts             # NextAuth API route handlers
│
components/
├── welcome/
│   ├── WelcomeCarousel.tsx          # Main carousel component
│   ├── WelcomeSlide.tsx             # Individual slide component
│   └── PaginationDots.tsx           # Carousel pagination indicators
│
├── auth/
│   ├── LoginForm.tsx                # Client Component - main form
│   ├── EmailInput.tsx               # Controlled email input
│   ├── PasswordInput.tsx            # Controlled password input
│   ├── SignInButton.tsx             # Submit button with loading state
│   └── SessionProvider.tsx          # NextAuth session provider wrapper
│
├── ui/                              # Existing shadcn/ui components
│   ├── button.tsx                   # Reuse for Sign In button
│   ├── input.tsx                    # Reuse for email/password
│   ├── label.tsx                    # Reuse for form labels
│   └── card.tsx                     # Reuse for form container
│
lib/
├── auth.ts                          # NextAuth configuration
├── auth.config.ts                   # Auth options and callbacks
├── data/
│   └── mock-user.ts                 # Static mock user credentials
└── validations/
    └── auth.ts                      # Zod schemas for login form

middleware.ts                        # Route protection middleware
```

### File Structure Details

#### **1. Mock User Data (`lib/data/mock-user.ts`)**
```typescript
export const MOCK_CREDENTIALS = {
  email: 'student@murasaki-edu.com',
  password: 'password123',
}

export const MOCK_USER = {
  id: 'student-001',
  email: 'student@murasaki-edu.com',
  name: 'John Doe',
  role: 'student',
}
```

#### **2. NextAuth Configuration (`lib/auth.ts`)**
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { MOCK_CREDENTIALS, MOCK_USER } from "./data/mock-user"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials

        // CURRENT: Static mock validation (no API call)
        if (
          email === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          return {
            id: MOCK_USER.id,
            email: MOCK_USER.email,
            name: MOCK_USER.name,
            role: MOCK_USER.role,
          }
        }

        // FUTURE: Call Elysia API using axios
        /*
        try {
          const api = (await import('./api/axios-instance')).default
          const response = await api.post('/auth/login', {
            email,
            password,
          })

          const { accessToken, user } = response.data

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken, // Store Elysia token
          }
        } catch (error) {
          return null
        }
        */

        return null // Invalid credentials
      },
    }),
  ],
})
```

#### **3. Auth Config (`lib/auth.config.ts`)**
```typescript
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAuthPage = nextUrl.pathname.startsWith('/login') ||
                          nextUrl.pathname.startsWith('/welcome')

      if (isOnAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
        return true
      }

      // Redirect unauthenticated users to welcome page
      if (!isLoggedIn) return Response.redirect(new URL('/welcome', nextUrl))

      return true
    },
    async jwt({ token, user }) {
      // Persist access token in JWT (for future Elysia integration)
      if (user) {
        token.id = user.id
        token.role = user.role
        // token.accessToken = user.accessToken // Future: Elysia token
      }
      return token
    },
    async session({ session, token }) {
      // Expose user data to client-side session
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        // session.accessToken = token.accessToken // Future: Elysia token
      }
      return session
    },
  },
  providers: [], // Providers added in auth.ts
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
} satisfies NextAuthConfig
```

#### **4. Login Form Component (`components/auth/LoginForm.tsx`)**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setIsLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ex: murasaki@example.com"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
      </Button>
    </form>
  )
}
```

#### **5. Welcome Carousel Component (`components/welcome/WelcomeCarousel.tsx`)**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WelcomeSlide } from './WelcomeSlide'
import { PaginationDots } from './PaginationDots'

const slides = [
  {
    id: 1,
    title: 'AI Education, Reimagined',
    description: 'Transform how you teach and learn AI with interactive tools that adapt to every classroom.',
    image: '/welcome-image.png', // From design assets
  },
  // Add more slides as needed
]

export function WelcomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push('/login')
    }
  }

  const handleSkip = () => {
    router.push('/login')
  }

  const isLastSlide = currentSlide === slides.length - 1

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-8">Welcome</h1>

      {/* Slide Content */}
      <div className="w-full max-w-lg">
        <WelcomeSlide slide={slides[currentSlide]} />
      </div>

      {/* Pagination Dots */}
      <div className="mt-8">
        <PaginationDots
          total={slides.length}
          current={currentSlide}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-lg mt-8">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-600"
        >
          Skip
        </Button>
        <Button
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90 rounded-full px-8"
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
```

#### **6. Middleware (`middleware.ts`)**
```typescript
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - welcome (public welcome page)
     * - login (public login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|welcome|login).*)',
  ],
}
```

#### **7. Validation Schema (`lib/validations/auth.ts`)**
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

---

## Session Management

**Session Storage:**
- HTTP-only cookie: `authjs.session-token` (or `__Secure-authjs.session-token` in production)
- Secure: true (production only)
- SameSite: 'lax'
- Max-Age: 7 days (configurable)

**Session Data Structure:**
```typescript
interface Session {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  expires: string      // ISO timestamp
  // accessToken: string  // Future: Elysia JWT token
}
```

**Session Access Patterns:**

1. **Server Components:**
```typescript
import { auth } from '@/lib/auth'

const session = await auth()
if (!session) redirect('/welcome')
```

2. **Client Components:**
```typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
// status: 'loading' | 'authenticated' | 'unauthenticated'
```

3. **API Routes (Future - with Elysia integration):**
```typescript
import { auth } from '@/lib/auth'
import api from '@/lib/api/axios-instance'

export async function GET() {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  // Use session.accessToken for Elysia API calls
  // api.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
}
```

---

## Route Protection Strategy

### Protected Routes
All routes except the following require authentication:
- `/welcome` - Welcome onboarding page (public)
- `/login` - Login page (public)
- `/api/auth/*` - NextAuth endpoints (public)
- `/_next/*` - Next.js internal routes
- `/favicon.ico`, static assets

### Middleware Logic
1. Check if user has valid session via NextAuth
2. If session exists → Allow access
3. If no session and accessing protected route → Redirect to `/welcome`
4. If logged in and accessing `/login` or `/welcome` → Redirect to `/` (home)

### Redirect Behavior
- Unauthenticated user visits site → Redirect to `/welcome`
- User completes welcome carousel → Redirect to `/login`
- After successful login → Redirect to homepage (`/`)
- After logout → Redirect to `/welcome`

---

## User Flow Diagrams

### Welcome & Login Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    Welcome & Login Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. User visits site (no session)
   │
   ▼
2. Middleware redirects to /welcome
   │
   ▼
3. WelcomeCarousel renders
   - Slide 1: AI Education, Reimagined
   - Pagination dots show position
   - Skip button (bottom left)
   - Next button (bottom right)
   │
   ├─ User clicks "Skip" ──────────────┐
   │                                   │
   ▼                                   ▼
4. User clicks "Next"                6. Redirect to /login
   │                                   │
   ▼                                   │
5. Advance to next slide              │
   (or /login if last slide)          │
   │                                   │
   └───────────────────────────────────┘
   │
   ▼
7. LoginForm component renders
   - Email input
   - Password input
   - Sign In button
   │
   ▼
8. User enters credentials and clicks "SIGN IN"
   │
   ▼
9. Form validation (client-side)
   - Email format check
   - Required fields check
   │
   ├─ Validation fails ──> Show error messages
   │
   ▼
10. Call signIn('credentials', { email, password })
    │
    ▼
11. NextAuth Credentials provider triggers
    │
    ▼
12. Check against static MOCK_CREDENTIALS
    - email === 'student@murasaki-edu.com'
    - password === 'password123'
    │
    ├─ Invalid ──> Return null ──> Show "Invalid credentials"
    │
    ▼
13. Return MOCK_USER object
    │
    ▼
14. NextAuth creates session
    - Store user data in JWT
    - Set HTTP-only session cookie
    │
    ▼
15. Redirect to homepage (/)
    │
    ▼
16. User is now authenticated
    - Session persists across page refreshes
    - Protected routes accessible
```

### Logout Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                        Logout Flow                              │
└─────────────────────────────────────────────────────────────────┘

1. User clicks logout button
   │
   ▼
2. Call signOut() from next-auth/react
   │
   ▼
3. NextAuth clears session cookie
   │
   ▼
4. Redirect to /welcome
   │
   ▼
5. User is logged out
   - Session cookie removed
   - Protected routes now redirect to /welcome
```

---

## API Integration (Future)

### When Elysia Auth Endpoint is Ready

**Update `lib/auth.ts` authorize function:**

```typescript
async authorize(credentials) {
  const { email, password } = credentials

  try {
    // Import axios instance
    const api = (await import('./api/axios-instance')).default

    // Call Elysia auth endpoint
    const response = await api.post('/auth/login', {
      email,
      password,
    })

    if (response.status !== 200) return null

    const { accessToken, user } = response.data

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken, // Store Elysia token in session
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}
```

**Elysia API Contract:**

**Request:**
```json
POST /auth/login
{
  "email": "student@murasaki-edu.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "student-001",
    "email": "student@murasaki-edu.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

### Authenticated API Calls (Future)

When making calls to Elysia with authenticated endpoints:

```typescript
// In Server Component or API Route
import { auth } from '@/lib/auth'
import api from '@/lib/api/axios-instance'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Set Authorization header
  api.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`

  // Make authenticated request
  const response = await api.get('/user/profile')

  return Response.json(response.data)
}
```

---

## Security Considerations

### Implemented Security Measures

1. **HTTP-Only Cookies**
   - Session token stored in HTTP-only cookie
   - Not accessible via JavaScript (prevents XSS attacks)
   - Automatically sent with requests

2. **CSRF Protection**
   - Built into NextAuth
   - Uses double-submit cookie pattern
   - Validates CSRF token on form submissions

3. **Secure Cookie Flags**
   - `Secure`: true in production (HTTPS only)
   - `SameSite`: 'lax' (prevents CSRF)
   - `HttpOnly`: true (prevents XSS)

4. **Password Masking**
   - Input type="password" hides characters
   - Password not logged or exposed in client

5. **Environment Variables**
   - `NEXTAUTH_SECRET` used for JWT signing
   - Secrets not committed to repository

6. **Input Validation**
   - Client-side validation with Zod
   - Prevents malformed requests

7. **Token Expiration**
   - Session max age: 7 days
   - JWT tokens include expiration claim

### Not Implemented (Out of Scope)

- ❌ Rate limiting (brute force protection)
- ❌ Account lockout after failed attempts
- ❌ Password strength requirements
- ❌ Password hashing (mock implementation)
- ❌ Email verification
- ❌ MFA (Multi-Factor Authentication)

---

## Styling Approach

### Tailwind CSS Configuration

Use existing Tailwind CSS v4 setup with custom design tokens:

```css
/* globals.css additions */
:root {
  --color-primary: #7C3AED;
  --color-primary-hover: #6D28D9;
  --color-error: #EF4444;
  --color-background: #F5F5F5;
}
```

### Component Styling Pattern

Use shadcn/ui component variants where possible:

```typescript
// Example: Sign In button
<Button
  type="submit"
  className="w-full bg-primary hover:bg-primary/90"
  disabled={isLoading}
>
  {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
</Button>
```

### Responsive Design

Mobile-first approach with Tailwind breakpoints:
- `sm:` (640px) - Tablet
- `md:` (768px) - Desktop
- `lg:` (1024px) - Large desktop

---

## Error Handling

### Error States

1. **Invalid Credentials**
   - Message: "Invalid email or password"
   - Display: Below Sign In button, red text
   - Clear on: New form submission

2. **Validation Errors**
   - Email: "Invalid email address"
   - Password: "Password is required"
   - Display: Below respective input field, small red text

3. **Session Expired**
   - Automatically redirect to /welcome
   - Optional: Show toast "Session expired. Please log in again."

### Error Display Component

```typescript
{error && (
  <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg">
    {error}
  </div>
)}
```

---

## Testing Strategy

### Unit Tests

**Test Files:**
- `components/auth/LoginForm.test.tsx`
- `components/welcome/WelcomeCarousel.test.tsx`
- `lib/auth.test.ts`
- `lib/validations/auth.test.ts`

**Test Cases:**

1. **LoginForm Component:**
   - ✅ Renders all form fields
   - ✅ Validates email format
   - ✅ Validates required fields
   - ✅ Shows error message on invalid credentials
   - ✅ Disables button during submission
   - ✅ Calls signIn with correct credentials
   - ✅ Redirects on successful login

2. **WelcomeCarousel Component:**
   - ✅ Renders first slide on mount
   - ✅ "Next" button advances to next slide
   - ✅ "Skip" button redirects to /login
   - ✅ Last slide "Next" redirects to /login
   - ✅ Pagination dots show correct active state

3. **Auth Configuration:**
   - ✅ Redirects unauthenticated users to /welcome
   - ✅ Redirects authenticated users away from /login
   - ✅ Validates mock credentials correctly
   - ✅ Stores user data in session

### Integration Tests

**Test Cases:**

1. **Welcome to Login Flow:**
   - ✅ Navigate to site (unauthenticated)
   - ✅ Verify redirect to /welcome
   - ✅ Click "Skip" → verify redirect to /login
   - ✅ OR navigate slides → verify redirect to /login on last slide

2. **Login Flow:**
   - ✅ Navigate to /login
   - ✅ Fill in valid mock credentials
   - ✅ Submit form
   - ✅ Verify redirect to homepage
   - ✅ Verify session cookie is set

3. **Protected Route:**
   - ✅ Navigate to protected route without session
   - ✅ Verify redirect to /welcome
   - ✅ Log in
   - ✅ Navigate to protected route
   - ✅ Verify access granted

### Mock Data for Tests

```typescript
export const mockLoginCredentials = {
  email: 'student@murasaki-edu.com',
  password: 'password123',
}

export const mockUser = {
  id: 'student-001',
  email: 'student@murasaki-edu.com',
  name: 'John Doe',
  role: 'student',
}

export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
}
```

---

## Environment Variables

### Required Variables

**.env.local:**
```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# API Backend (for future Elysia integration)
API_BASE_URL=http://localhost:8080/api

# Public API URL (for client-side proxy)
NEXT_PUBLIC_API_BASE_URL=/api/proxy
```

### Generate Secret
```bash
openssl rand -base64 32
```

---

## Dependencies

### New Dependencies to Install

```bash
bun add next-auth@beta @auth/core
bun add react-hook-form @hookform/resolvers zod
bun add embla-carousel-react  # For welcome carousel (or use alternative)
```

### Existing Dependencies (Already in Project)
- next (16.0.1)
- react (19.2.0)
- tailwindcss (v4)
- axios
- shadcn/ui components

---

## Migration Path

### Current → Elysia Integration

**Changes Required:**

1. **Update `lib/auth.ts` authorize function** (shown above)
2. **No changes needed to:**
   - UI components (LoginForm, WelcomeCarousel, etc.)
   - Session management (`auth.config.ts`)
   - Middleware route protection
   - API integration pattern
   - Environment variables (already configured)

**Migration Checklist:**
- [ ] Elysia `/auth/login` endpoint is ready and tested
- [ ] Update `authorize()` function to call Elysia API using axios
- [ ] Update JWT callback to store `accessToken`
- [ ] Update session callback to expose `accessToken`
- [ ] Test login flow with Elysia backend
- [ ] Update tests to mock Elysia API responses

---

## Accessibility Considerations

### WCAG 2.1 Level A Compliance

1. **Form Labels**
   - All inputs have associated `<label>` elements
   - Labels are visible and descriptive

2. **Keyboard Navigation**
   - Tab order follows logical flow
   - Focus indicators visible on all interactive elements
   - Form submittable via Enter key
   - Carousel navigable via keyboard

3. **Error Identification**
   - Error messages clearly associated with fields
   - Errors announced to screen readers
   - Use `aria-invalid` and `aria-describedby`

4. **Color Contrast**
   - Text meets 4.5:1 contrast ratio
   - Error messages meet contrast requirements
   - Focus indicators have 3:1 contrast

5. **Screen Reader Support**
   - Form purpose clear from heading
   - Loading states announced
   - Error messages announced
   - Carousel slides have descriptive alt text

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Login and welcome pages use minimal client-side JS
   - NextAuth libraries loaded only when needed
   - Lazy load non-critical components

2. **Image Optimization**
   - Welcome page illustration served via Next.js Image component
   - Properly sized and optimized format (WebP preferred)
   - Murasaki logo as SVG

3. **Form Performance**
   - Prevent double submissions
   - Optimistic UI updates

4. **Session Loading**
   - Server Components use `await auth()` (no loading state)
   - Client Components show loading skeleton during session check

### Performance Metrics Targets

- Time to Interactive (TTI): < 2s
- Login validation: < 100ms (static check)
- Session validation: < 100ms (local JWT verify)
- Form submission feedback: < 100ms (loading state)
- Carousel transition: 60fps smooth animation

---

## Success Criteria Checklist

### Functional Requirements
- [ ] Welcome page renders with carousel
- [ ] Carousel navigation works (Next, Skip)
- [ ] Pagination dots show correct state
- [ ] Welcome page redirects to /login
- [ ] Login form renders with email and password inputs
- [ ] Form validation works (email format, required fields)
- [ ] Successful login with mock credentials redirects to homepage
- [ ] Invalid credentials show error message
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users to /welcome
- [ ] Logout clears session and redirects to /welcome
- [ ] Loading states shown during authentication

### UI/UX Requirements
- [ ] Welcome page matches `design/pbi-3-login/welcome-page.png`
- [ ] Login page matches `design/pbi-3-login/login-page.png`
- [ ] Responsive layout works on mobile (320px+)
- [ ] Forms are accessible (keyboard nav, screen readers)
- [ ] Error messages are clear and actionable
- [ ] Buttons disabled during submission
- [ ] Smooth carousel transitions

### Technical Requirements
- [ ] NextAuth v5 properly configured
- [ ] Static mock credentials work correctly
- [ ] Session stored in HTTP-only cookie
- [ ] Middleware protects routes
- [ ] Code ready for Elysia integration (axios setup)
- [ ] Environment variables configured

### Testing Requirements
- [ ] Unit tests for LoginForm component pass
- [ ] Unit tests for WelcomeCarousel component pass
- [ ] Unit tests for validation schema pass
- [ ] Integration test for welcome flow passes
- [ ] Integration test for login flow passes
- [ ] Integration test for protected route access passes

### Security Requirements
- [ ] Passwords masked in input field
- [ ] CSRF protection enabled
- [ ] Secure cookies configured for production
- [ ] Secrets stored in environment variables
- [ ] No sensitive data logged to console

---

## References

- [NextAuth v5 Documentation](https://authjs.dev/)
- [Credentials Provider Guide](https://authjs.dev/getting-started/providers/credentials)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Embla Carousel](https://www.embla-carousel.com/)
