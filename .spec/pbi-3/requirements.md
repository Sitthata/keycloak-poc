# PBI-3: Student Login and Welcome

## Overview

Enable students to authenticate into the Murasaki-edu platform using email and password credentials, with an introductory welcome/onboarding experience. This feature establishes the foundation for personalized learning experiences and progress tracking.

## Functional Requirements

### FR-1: Welcome/Onboarding Page
- The system SHALL provide a welcome page for first-time or unauthenticated users
- The system SHALL display an onboarding carousel with multiple slides
- The system SHALL show educational content about the platform's features
- The system SHALL provide navigation controls (Skip, Next buttons)
- The system SHALL show pagination indicators (dots) for the carousel
- The system SHALL allow users to skip the onboarding and go directly to login
- The system SHALL automatically redirect to login after completing the carousel

### FR-2: Login Form
- The system SHALL provide a login form with email and password input fields
- The system SHALL validate email format before submission
- The system SHALL validate that password field is not empty
- The system SHALL display appropriate validation error messages for invalid inputs
- The system SHALL provide a "Login" button to submit credentials
- The system SHALL disable the login button while authentication is in progress
- The system SHALL provide visual feedback (e.g., loading state) during login process

### FR-3: Authentication
- The system SHALL accept email and password credentials via the login form
- The system SHALL authenticate users against static mock credential data (no API call)
- The system SHALL return user session data upon successful authentication
- The system SHALL display an error message for invalid credentials
- The system SHALL maintain user session after successful login
- The system SHALL redirect authenticated users to the homepage or intended destination

### FR-4: Session Management
- The system SHALL store authentication state in a secure session cookie
- The system SHALL persist user session across page refreshes
- The system SHALL provide a logout mechanism to clear the session
- The system SHALL protect authenticated routes from unauthorized access

### FR-5: User Data Response
Mock user data returned upon successful login SHALL include:
- User ID
- Full name
- Email address
- Role (student)
- Any additional profile information needed for the application

## Scope

### In Scope
- Welcome/onboarding page with carousel slides
- Login UI component with email and password fields
- Client-side form validation
- Session management using NextAuth
- Mock credential verification (static mock data, no backend API call)
- Authenticated routing protection
- Logout functionality
- Error handling and user feedback

### Out of Scope
- Student registration/signup functionality (deferred to future PBI)
- Password reset/forgot password functionality
- OAuth/social login (Google, Microsoft, etc.) - UI shown but non-functional
- Multi-factor authentication (MFA)
- Email verification
- Account management features (profile editing, password change)
- Integration with production authentication service (Keycloak)
- Integration with Elysia backend auth API (using static mock for now)
- Rate limiting or brute force protection
- Remember me functionality
- Persistent onboarding state (tracking if user has seen welcome slides)

## User Stories

### US-1: Welcome Onboarding
**As a** new visitor
**I want to** see an introduction to the platform's features
**So that** I understand what the platform offers before signing in

**Acceptance Criteria:**
- Given I visit the site as a new/unauthenticated user
- When I land on the welcome page
- Then I should see a carousel with educational content
- And I should see pagination dots indicating my position
- And I should be able to navigate between slides using "Next" button
- And I should be able to skip onboarding using "Skip" button
- And both "Skip" and completing the carousel should take me to the login page

### US-2: Student Login
**As a** student
**I want to** log in with my email and password
**So that** I can access my personalized learning content and track my progress

**Acceptance Criteria:**
- Given I am on the login page
- When I enter valid email and password credentials
- And I click the "Login" button
- Then I should be authenticated and redirected to the homepage
- And I should see my name/profile information in the UI
- And my session should persist across page refreshes

### US-3: Invalid Login Attempt
**As a** student
**I want to** receive clear feedback when login fails
**So that** I understand what went wrong and can correct my credentials

**Acceptance Criteria:**
- Given I am on the login page
- When I enter invalid email or password
- And I click the "Login" button
- Then I should see an error message indicating invalid credentials
- And I should remain on the login page
- And the form should be ready for me to retry

### US-4: Protected Content Access
**As a** student
**I want** unauthenticated access to protected pages to be blocked
**So that** my learning progress and data remain secure

**Acceptance Criteria:**
- Given I am not logged in
- When I attempt to access a protected page (e.g., /pages/[pageId])
- Then I should be redirected to the welcome or login page
- And after successful login, I should be redirected to my originally intended page

### US-5: Logout
**As a** logged-in student
**I want to** log out of my account
**So that** I can secure my session when using shared devices

**Acceptance Criteria:**
- Given I am logged in
- When I click the logout button/link
- Then my session should be cleared
- And I should be redirected to the welcome page or login page
- And attempting to access protected pages should require login again

## Non-Functional Requirements

### NFR-1: Security
- Passwords SHALL NOT be visible in plain text (use password input type)
- Session tokens SHALL be stored securely in HTTP-only cookies
- Sensitive data SHALL NOT be logged in console or error messages

### NFR-2: Usability
- Welcome page and login form SHALL be responsive and work on mobile devices (320px minimum width)
- Carousel navigation SHALL be intuitive and smooth
- Form validation messages SHALL be clear and actionable
- Loading states SHALL be visible to prevent duplicate submissions
- Pages SHALL be accessible (WCAG 2.1 Level A minimum)

### NFR-3: Performance
- Login request SHALL complete within 3 seconds under normal conditions
- UI SHALL provide feedback within 100ms of user interaction
- Carousel transitions SHALL be smooth (60fps)

## Mock Data Requirements

The system SHALL use hardcoded mock credentials for development:

**Mock Student Account:**
- Email: `student@murasaki-edu.com`
- Password: `password123`
- Returned user data:
  - ID: `student-001`
  - Name: `John Doe`
  - Email: `student@murasaki-edu.com`
  - Role: `student`

Additional mock accounts MAY be added for testing different user scenarios.

## Dependencies

- NextAuth library for session management
- Existing Next.js routing structure
- Carousel/slider component library (or custom implementation)

## Constraints

- This implementation uses static mock authentication (no API calls) and is NOT production-ready
- Elysia backend auth endpoint is under development - will be integrated in future iteration
- Real authentication service (Keycloak) integration will be implemented in a future PBI
- Password strength requirements are NOT enforced in this PBI
- Welcome page onboarding state is NOT persisted (users see it every time unless logged in)

## Success Criteria

- [ ] Welcome page displays with carousel functionality
- [ ] Users can navigate through onboarding slides
- [ ] Skip and Next buttons work correctly
- [ ] Welcome page redirects to login when completed or skipped
- [ ] Students can successfully log in with valid mock credentials (static validation)
- [ ] Invalid login attempts show appropriate error messages
- [ ] Authenticated session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users to welcome/login pages
- [ ] Students can successfully log out
- [ ] Login form is responsive and accessible
- [ ] All acceptance criteria for user stories are met
- [ ] Unit tests cover login component and authentication logic
