# PBI-3: Student Login and Welcome - Implementation Tasks

## Overview
This document breaks down the implementation of PBI-3 into specific, actionable tasks organized by category. Check off tasks as you complete them.

---

## 1. Setup & Dependencies

### 1.1 Install Required Packages
- [x] Install NextAuth v5 (beta)
  ```bash
  bun add next-auth@beta @auth/core
  ```
- [x] Install form management libraries
  ```bash
  bun add react-hook-form @hookform/resolvers zod
  ```
- [x] Install carousel library (optional - can build custom)
  ```bash
  bun add embla-carousel-react
  # OR use alternative: bun add swiper
  # OR build custom carousel component
  ```
- [x] Verify existing dependencies are installed
  - axios
  - tailwindcss
  - shadcn/ui components

---

## 2. Environment Configuration

### 2.1 Environment Variables
- [x] Create or update `.env.local` file
- [x] Add `NEXTAUTH_URL=http://localhost:3000`
- [x] Generate and add `NEXTAUTH_SECRET` (run: `openssl rand -base64 32`)
- [x] Verify `API_BASE_URL` exists (for future Elysia integration)
- [ ] Add `.env.local` to `.gitignore` if not already present

### 2.2 Environment Variables Documentation
- [x] Document all required environment variables
- [ ] Create `.env.example` file with placeholder values

---

## 3. Type Definitions

### 3.1 NextAuth Type Extensions
- [x] Create `types/next-auth.d.ts`
- [x] Extend `User` interface to include `role` field
- [x] Extend `Session` interface to include `user.id`, `user.role`, and optional `accessToken`
- [x] Extend `JWT` interface to include `id`, `role`, and optional `accessToken`

**File: `types/next-auth.d.ts`**
```typescript
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string
    accessToken?: string
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    accessToken?: string
  }
}
```

### 3.2 Form Validation Types
- [x] Create `lib/validations/auth.ts`
- [x] Define Zod schema for login form (`loginSchema`)
- [x] Export `LoginFormData` type from schema

---

## 4. Mock Data

### 4.1 Create Mock User Data
- [x] Create directory `lib/data/`
- [x] Create `lib/data/mock-user.ts`
- [x] Define `MOCK_CREDENTIALS` constant (email, password)
- [x] Define `MOCK_USER` constant (id, email, name, role)
- [x] Export both constants

**Mock Values:**
- Email: `student@murasaki-edu.com`
- Password: `password123`
- User ID: `student-001`
- Name: `John Doe`
- Role: `student`

---

## 5. NextAuth Configuration

### 5.1 Auth Configuration File
- [x] Create `lib/auth.config.ts`
- [x] Configure `pages` option (signIn: '/login', error: '/login')
- [x] Implement `authorized` callback for route protection
  - Redirect unauthenticated users to `/welcome`
  - Redirect authenticated users away from `/login` and `/welcome`
- [x] Implement `jwt` callback to store user data in token
- [x] Implement `session` callback to expose user data to client
- [x] Set session strategy to `'jwt'`
- [x] Set session maxAge to 7 days

### 5.2 Main Auth File
- [x] Create `lib/auth.ts`
- [x] Import NextAuth and Credentials provider
- [x] Import auth config and mock data
- [x] Configure Credentials provider with `authorize` function
- [x] Implement static mock validation (check email and password)
- [x] Add commented code for future Elysia integration
- [x] Export `handlers`, `auth`, `signIn`, `signOut`

### 5.3 NextAuth API Route
- [x] Create directory `app/api/auth/[...nextauth]/`
- [x] Create `app/api/auth/[...nextauth]/route.ts`
- [x] Import `handlers` from `@/lib/auth`
- [x] Export GET and POST handlers

**File: `app/api/auth/[...nextauth]/route.ts`**
```typescript
import { handlers } from "@/lib/auth"

export const GET = handlers.GET
export const POST = handlers.POST
```

---

## 6. Middleware & Route Protection

### 6.1 Create Middleware
- [x] Create `middleware.ts` at project root
- [x] Export auth as middleware from `@/lib/auth`
- [x] Configure matcher to protect all routes except:
  - `/api/*`
  - `/_next/static/*`
  - `/_next/image/*`
  - `/favicon.ico`
  - `/welcome`
  - `/login`

### 6.2 Test Route Protection
- [ ] Verify unauthenticated users redirect to `/welcome`
- [ ] Verify authenticated users can access protected routes
- [ ] Verify authenticated users redirect away from `/login` and `/welcome`

---

## 7. Welcome Page Components

### 7.1 Welcome Page Route
- [x] Create directory `app/(auth)/welcome/`
- [x] Create `app/(auth)/welcome/page.tsx`
- [x] Import and render `WelcomeCarousel` component
- [x] Add metadata (title: "Welcome to Murasaki")

### 7.2 Welcome Carousel Component
- [x] Create directory `components/welcome/`
- [x] Create `components/welcome/WelcomeCarousel.tsx` (Client Component)
- [x] Set up state for current slide index
- [x] Define slides data array with title, description, image
- [x] Implement `handleNext` function
  - Advance to next slide if not last
  - Redirect to `/login` if last slide
- [x] Implement `handleSkip` function to redirect to `/login`
- [x] Render header ("Welcome")
- [x] Render current slide
- [x] Render pagination dots
- [x] Render Skip and Next buttons
- [x] Add responsive styling (mobile-first)

### 7.3 Welcome Slide Component
- [x] Create `components/welcome/WelcomeSlide.tsx`
- [x] Accept slide data as props (title, description, image)
- [x] Render white card with shadow and rounded corners
- [x] Render image using Next.js Image component
- [x] Render title (bold, large)
- [x] Render description (gray, centered)
- [x] Add responsive padding and spacing

### 7.4 Pagination Dots Component
- [x] Create `components/welcome/PaginationDots.tsx`
- [x] Accept `total` and `current` as props
- [x] Render dots using flexbox
- [x] Style active dot with primary purple color
- [x] Style inactive dots with light gray
- [x] Make dots 8px diameter with 8px spacing

### 7.5 Welcome Page Assets
- [x] Add welcome illustration image to `public/` folder
  - Use image from `design/pbi-3-login/welcome-page.png` or similar
- [x] Optimize image (WebP format preferred)
- [x] Name file `welcome-image.png` or `welcome-image.webp`

### 7.6 Carousel Behavior
- [x] Test slide navigation with Next button
- [x] Test skip button redirects to login
- [x] Test last slide Next button shows "Get Started"
- [x] Verify smooth transitions between slides
- [x] Test responsive layout on mobile (320px+)

---

## 8. Login Page Components

### 8.1 Login Page Route
- [x] Create directory `app/(auth)/login/`
- [x] Create `app/(auth)/login/page.tsx`
- [x] Import and render `LoginForm` component
- [x] Add Murasaki logo at top
- [x] Add heading "Sign in your account"
- [x] Add metadata (title: "Login - Murasaki")
- [x] Wrap page in centered card layout

### 8.2 Login Form Component
- [x] Create directory `components/auth/`
- [x] Create `components/auth/LoginForm.tsx` (Client Component)
- [x] Set up React Hook Form with Zod validation
- [x] Add email input field with label and validation
- [x] Add password input field with label and validation
- [x] Add error state for invalid credentials
- [x] Add loading state during submission
- [x] Implement `onSubmit` handler
  - Call `signIn('credentials', { email, password, redirect: false })`
  - Handle success: redirect to `/` and refresh router
  - Handle error: show "Invalid email or password" message
- [x] Disable form inputs during loading
- [x] Disable submit button during loading

### 8.3 Form Fields
- [x] Use shadcn/ui `Input` component for email
- [x] Use shadcn/ui `Input` component with type="password"
- [x] Use shadcn/ui `Label` components for field labels
- [x] Use shadcn/ui `Button` component for submit button
- [x] Add proper placeholder text
  - Email: "ex: murasaki@example.com"
  - Password: "••••••••"

### 8.4 Error Handling
- [x] Display validation errors below each field (red text)
- [x] Display authentication error in alert box (red background)
- [x] Clear errors on new form submission
- [x] Ensure error messages are accessible (aria attributes)

### 8.5 OAuth UI (Non-functional)
- [x] Add "or sign in with" divider below Sign In button
- [x] Add Microsoft OAuth button (white background, logo)
- [x] Make button visually disabled or add tooltip "Coming soon"
- [x] Do NOT implement OAuth functionality (out of scope)

### 8.6 Sign Up Link (Non-functional)
- [x] Add "Don't have an account? SIGN UP" text below form
- [x] Style "SIGN UP" text in purple color
- [x] Add link element (can point to # or /signup)
- [x] Do NOT implement registration (out of scope)

### 8.7 Login Page Assets
- [ ] Add Murasaki logo to `public/` folder
  - Purple square with smile and lightbulb icon
- [ ] Optimize logo as SVG if possible
- [ ] Name file `murasaki-logo.svg` or `murasaki-logo.png`

### 8.8 Login Page Styling
- [x] Apply centered card layout (max-width 400px)
- [x] Add light background (#F5F5F5)
- [x] Add card padding (2.5rem)
- [x] Add rounded corners to card (~16px)
- [x] Apply consistent spacing between elements
- [x] Ensure responsive design (full width on mobile)

---

## 9. Session Provider

### 9.1 Session Provider Component
- [x] Create `components/auth/SessionProvider.tsx`
- [x] Import `SessionProvider` from `next-auth/react`
- [x] Create wrapper component that accepts children
- [x] Export wrapper component

### 9.2 Root Layout Integration
- [x] Open `app/layout.tsx`
- [x] Import SessionProvider wrapper
- [x] Wrap `{children}` with SessionProvider
- [x] Ensure it's a Client Component if needed

---

## 10. Auth Route Group Layout

### 10.1 Create Auth Layout
- [x] Create `app/(auth)/layout.tsx`
- [x] Remove navbar/header from auth pages
- [x] Remove footer from auth pages
- [x] Apply centered layout styling
- [x] Return minimal layout with just children

**Purpose:** Auth pages (welcome, login) should not show navigation elements.

---

## 11. Styling & Design System

### 11.1 Tailwind Configuration
- [ ] Verify Tailwind CSS v4 is configured
- [ ] Add custom color for primary purple in config/globals.css
  - `--color-primary: #7C3AED`
  - `--color-primary-hover: #6D28D9`
- [ ] Verify responsive breakpoints are set
- [ ] Test Tailwind classes are working

### 11.2 Typography
- [ ] Ensure consistent font family (Inter or system default)
- [ ] Apply heading styles (24px, bold)
- [ ] Apply label styles (14px, medium)
- [ ] Apply button text styles (14px, semi-bold, uppercase)

### 11.3 Color Palette
- [ ] Verify primary purple (#7C3AED) is used for buttons and links
- [ ] Verify gray colors for text and borders match design
- [ ] Verify error red (#EF4444) is used for error messages
- [ ] Test color contrast meets WCAG AA standards

---

## 12. Testing

### 12.1 Unit Tests - Login Form
- [ ] Create `components/auth/LoginForm.test.tsx`
- [ ] Test: Form renders with email and password inputs
- [ ] Test: Email validation shows error for invalid format
- [ ] Test: Required field validation works
- [ ] Test: Submit button disabled during loading
- [ ] Test: Error message displays for invalid credentials
- [ ] Test: Successful login calls signIn with correct data
- [ ] Mock `signIn` function from next-auth/react

### 12.2 Unit Tests - Welcome Carousel
- [ ] Create `components/welcome/WelcomeCarousel.test.tsx`
- [ ] Test: First slide renders on mount
- [ ] Test: Next button advances to next slide
- [ ] Test: Skip button redirects to /login
- [ ] Test: Last slide Next button shows "Get Started"
- [ ] Test: Last slide Next button redirects to /login
- [ ] Test: Pagination dots show correct active state

### 12.3 Unit Tests - Auth Validation
- [ ] Create `lib/validations/auth.test.ts`
- [ ] Test: Valid email and password pass validation
- [ ] Test: Invalid email format fails validation
- [ ] Test: Empty email fails validation
- [ ] Test: Empty password fails validation

### 12.4 Integration Tests - Login Flow
- [ ] Test: Navigate to site as unauthenticated user
- [ ] Test: Verify redirect to /welcome
- [ ] Test: Click Skip → redirects to /login
- [ ] Test: Fill valid credentials → submit
- [ ] Test: Verify redirect to homepage
- [ ] Test: Verify session cookie is set

### 12.5 Integration Tests - Route Protection
- [ ] Test: Unauthenticated user tries to access protected route
- [ ] Test: Verify redirect to /welcome
- [ ] Test: User logs in successfully
- [ ] Test: User can access protected route
- [ ] Test: Authenticated user visits /login → redirects to /

### 12.6 Integration Tests - Logout
- [ ] Test: User logs in successfully
- [ ] Test: User clicks logout
- [ ] Test: Session cookie cleared
- [ ] Test: Verify redirect to /welcome
- [ ] Test: Protected routes now redirect to /welcome

---

## 13. Accessibility

### 13.1 Form Accessibility
- [ ] Verify all inputs have associated labels
- [ ] Add `aria-invalid` to inputs with errors
- [ ] Add `aria-describedby` linking errors to inputs
- [ ] Ensure form is keyboard navigable (tab order)
- [ ] Test form submission with Enter key
- [ ] Add proper `aria-label` or `aria-labelledby` where needed

### 13.2 Carousel Accessibility
- [ ] Add descriptive alt text to welcome images
- [ ] Ensure Skip and Next buttons are keyboard accessible
- [ ] Add `aria-label` to pagination dots
- [ ] Test carousel navigation with keyboard only

### 13.3 Color Contrast
- [ ] Verify text color contrast ratio ≥ 4.5:1
- [ ] Verify button text contrast ratio ≥ 4.5:1
- [ ] Verify error text contrast ratio ≥ 4.5:1
- [ ] Test focus indicators are visible and have ≥ 3:1 contrast

### 13.4 Screen Reader Testing
- [ ] Test login form with screen reader
- [ ] Verify error messages are announced
- [ ] Test welcome carousel with screen reader
- [ ] Verify loading states are announced

---

## 14. Manual Testing

### 14.1 Happy Path Testing
- [ ] Visit site → see welcome page
- [ ] Navigate through welcome slides
- [ ] Click "Get Started" → see login page
- [ ] Enter valid credentials → submit
- [ ] Verify redirect to homepage
- [ ] Verify name/profile info displayed
- [ ] Refresh page → verify still logged in
- [ ] Navigate to protected route → verify access granted

### 14.2 Error Path Testing
- [ ] Enter invalid email format → see validation error
- [ ] Enter empty password → see validation error
- [ ] Enter wrong credentials → see "Invalid email or password"
- [ ] Verify form is ready to retry after error
- [ ] Test button disabled state during submission

### 14.3 Route Protection Testing
- [ ] Open new incognito window
- [ ] Try to access protected route directly
- [ ] Verify redirect to /welcome
- [ ] Log in successfully
- [ ] Verify redirect to originally intended page (if implemented)

### 14.4 Logout Testing
- [ ] Log in successfully
- [ ] Find and click logout button
- [ ] Verify redirect to /welcome
- [ ] Try to access protected route
- [ ] Verify redirect to /welcome (not logged in)

### 14.5 Responsive Testing
- [ ] Test welcome page on mobile (320px width)
- [ ] Test login page on mobile (320px width)
- [ ] Test welcome page on tablet (768px width)
- [ ] Test login page on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify card layout is centered and readable at all sizes

### 14.6 Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify consistent behavior across browsers

---

## 15. Documentation

### 15.1 Code Documentation
- [ ] Add JSDoc comments to all exported functions
- [ ] Add comments explaining mock credential logic
- [ ] Add TODO comments for future Elysia integration
- [ ] Document environment variables in README

### 15.2 User Documentation
- [ ] Document how to run the app locally
- [ ] Document test credentials for development
  - Email: `student@murasaki-edu.com`
  - Password: `password123`
- [ ] Add screenshots of welcome and login pages (optional)

### 15.3 Migration Documentation
- [ ] Document steps to integrate with Elysia (already in design.md)
- [ ] Create checklist for Elysia integration
- [ ] Document how to test with real backend

---

## 16. Performance Optimization

### 16.1 Image Optimization
- [ ] Ensure welcome image uses Next.js Image component
- [ ] Set proper width and height attributes
- [ ] Use WebP format if possible
- [ ] Add loading="lazy" if appropriate

### 16.2 Code Splitting
- [ ] Verify LoginForm is code-split (client component)
- [ ] Verify WelcomeCarousel is code-split (client component)
- [ ] Use dynamic imports for heavy libraries if needed

### 16.3 Bundle Size
- [ ] Check bundle size of auth pages
- [ ] Verify no unnecessary dependencies imported
- [ ] Consider lazy loading carousel library

---

## 17. Security Review

### 17.1 Environment Variables
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify `NEXTAUTH_SECRET` is not committed
- [ ] Verify no secrets in client-side code

### 17.2 Session Security
- [ ] Verify session cookie is HTTP-only
- [ ] Verify session cookie is Secure in production
- [ ] Verify session cookie has SameSite attribute
- [ ] Verify session has reasonable expiration (7 days)

### 17.3 Input Validation
- [ ] Verify email format validation on client
- [ ] Verify password is not logged anywhere
- [ ] Verify error messages don't leak sensitive info

---

## 18. Production Readiness

### 18.1 Environment Configuration
- [ ] Set `NEXTAUTH_URL` for production domain
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Document production environment variables

### 18.2 Build & Deploy
- [ ] Run production build locally (`bun run build`)
- [ ] Test production build (`bun start`)
- [ ] Verify no build errors or warnings
- [ ] Test auth flow in production mode
- [ ] Deploy to staging environment
- [ ] Test auth flow in staging

---

## 19. Code Review & Cleanup

### 19.1 Code Quality
- [ ] Remove console.logs (except intentional error logging)
- [ ] Remove commented-out code (except future integration notes)
- [ ] Ensure consistent code formatting
- [ ] Run linter and fix issues

### 19.2 File Organization
- [ ] Verify all files are in correct directories
- [ ] Ensure consistent naming conventions
- [ ] Remove unused imports
- [ ] Remove unused files

### 19.3 Git Hygiene
- [ ] Commit changes with clear messages
- [ ] Create feature branch for PBI-3
- [ ] Squash WIP commits if needed
- [ ] Create pull request with description

---

## 20. Final Verification

### 20.1 Requirements Checklist
Review against `requirements.md`:
- [ ] Welcome page displays with carousel functionality
- [ ] Users can navigate through onboarding slides
- [ ] Skip and Next buttons work correctly
- [ ] Welcome page redirects to login when completed or skipped
- [ ] Students can successfully log in with valid mock credentials
- [ ] Invalid login attempts show appropriate error messages
- [ ] Authenticated session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users to welcome page
- [ ] Students can successfully log out
- [ ] Login form is responsive and accessible
- [ ] All acceptance criteria for user stories are met

### 20.2 Design Checklist
Review against `design.md`:
- [ ] Welcome page matches UI design specifications
- [ ] Login page matches UI design specifications
- [ ] Color palette is consistent (#7C3AED purple, etc.)
- [ ] Typography matches design (font sizes, weights)
- [ ] Spacing and layout match design
- [ ] Responsive breakpoints work correctly
- [ ] All components use Tailwind CSS classes
- [ ] Carousel behavior matches specifications

### 20.3 Ready for Review
- [ ] All critical tasks completed
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] Documentation updated
- [ ] Pull request created
- [ ] Demo video/screenshots prepared (optional)

---

## Notes

- **Priority:** Focus on core functionality first (tasks 1-8), then styling and testing
- **Testing Strategy:** Write tests as you build components, don't save for the end
- **Incremental Commits:** Commit after completing each major section
- **Ask for Help:** If blocked on any task, document the blocker and ask for guidance

---

## Future Work (Out of Scope for PBI-3)

The following items are explicitly out of scope but noted for future reference:
- [ ] Student registration functionality
- [ ] Password reset/forgot password
- [ ] OAuth integration (Google, Microsoft)
- [ ] Multi-factor authentication
- [ ] Email verification
- [ ] Elysia backend integration (when endpoint is ready)
- [ ] Keycloak integration (future PBI)
- [ ] Persistent welcome page state (track if user has seen onboarding)
- [ ] Additional welcome carousel slides (beyond first slide)
