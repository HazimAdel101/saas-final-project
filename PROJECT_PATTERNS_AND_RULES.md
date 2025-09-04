# Project Patterns and Development Rules

## Project Overview

This is a **Next.js 15 Dashboard Starter** built with modern web technologies following established patterns and best practices. The project is designed as an e-commerce services dashboard with internationalization support.

### Core Technologies Stack

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript 5.7.2",
  "runtime": "React 19.0.0",
  "styling": "Tailwind CSS v4",
  "components": "shadcn/ui (New York style)",
  "auth": "Clerk",
  "database": "PostgreSQL with Prisma ORM",
  "state": "Zustand with persistence",
  "forms": "React Hook Form + Zod validation",
  "i18n": "next-intl",
  "monitoring": "Sentry",
  "commands": "kbar (Command+K interface)",
  "tables": "TanStack Table",
  "drag-drop": "@dnd-kit",
  "search-params": "nuqs",
  "package-manager": "pnpm"
}
```

## Architecture Patterns

### 1. Feature-Based Organization

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── (user)/        # User-facing pages
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Protected dashboard routes
│   └── api/               # API routes
├── components/            # Shared components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout-specific components
│   └── [shared-components]
├── features/              # Feature modules
│   ├── [feature-name]/
│   │   ├── components/    # Feature-specific components
│   │   ├── actions/       # Server actions
│   │   ├── utils/         # Feature utilities
│   │   └── schemas/       # Validation schemas
├── lib/                   # Core utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── constants/             # Application constants
```

### 2. Routing Structure

**Internationalized Routing (i18n)**:
- Base route: `/[locale]` (supports: `en`, `ar`)
- Authentication: `/[locale]/auth/sign-in`, `/[locale]/auth/sign-up`
- Dashboard: `/[locale]/dashboard/*`
- User pages: `/[locale]/(user)/*`

**Route Groups**:
- `(user)`: Public user-facing pages
- `(auth)`: Authentication pages
- `dashboard`: Protected dashboard routes

## Development Rules and Patterns

### 1. Code Style and Structure

**TypeScript Configuration**:
```json
{
  "strict": true,
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./public/*"]
  }
}
```

**Import Aliases**:
- `@/*` → `./src/*`
- `~/*` → `./public/*`

**File Naming Conventions**:
- Components: `PascalCase.tsx` (e.g., `ProductForm.tsx`)
- Utilities: `kebab-case.ts` (e.g., `use-debounce.ts`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Actions: `*-actions.ts` (e.g., `product-actions.ts`)

### 2. Component Patterns

**UI Components (shadcn/ui)**:
- Configuration: New York style with CSS variables
- Base color: zinc
- Radius: 0.5rem
- Location: `src/components/ui/`

**Component Structure**:
```tsx
// Standard component pattern
'use client' // Only when needed

import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ 
  className, 
  ...props 
}: ComponentNameProps) {
  return (
    <div 
      className={cn("base-classes", className)}
      {...props}
    />
  )
}
```

**Component Variants (CVA Pattern)**:
```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes"
      },
      size: {
        default: "default-size",
        sm: "small-size"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)
```

### 3. Form Handling

**Form Pattern** (React Hook Form + Zod):
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email")
})

export function FormComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

### 4. Server Actions Pattern

**Server Actions** (`'use server'`):
```tsx
'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface ActionInput {
  // Input type definition
}

export async function actionName(input: ActionInput) {
  try {
    // Database operations
    const result = await prisma.model.create({
      data: input
    })
    
    // Revalidate relevant paths
    revalidatePath('/dashboard/path')
    
    return result
  } catch (error) {
    throw new Error('Action failed')
  }
}
```

### 5. State Management (Zustand)

**Store Pattern**:
```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  // State definition
}

interface Actions {
  // Action definitions
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      
      // Actions
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      }))
    }),
    { 
      name: 'store-name',
      skipHydration: true // For SSR
    }
  )
)
```

### 6. Database Schema (Prisma)

**Model Patterns**:
```prisma
model Product {
  id            Int             @id @default(autoincrement())
  price_usd     Decimal         @db.Decimal
  price_ksa     Decimal         @db.Decimal
  image_url     String
  productDetails ProductDetail[]
}

model ProductDetail {
  id          Int      @id @default(autoincrement())
  product_id  Int
  name        String
  description String   @db.Text
  features    Json
  language_id Int
  product     Product  @relation(fields: [product_id], references: [id])
  language    Language @relation(fields: [language_id], references: [id])
}
```

### 7. Styling Patterns

**Tailwind CSS v4 Configuration**:
- Uses CSS variables for theming
- Custom themes: default, blue, green, amber, mono
- Scaling support with `theme-scaled` class
- Dark mode support via CSS custom properties

**CSS Variable Pattern**:
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.1363 0.0364 259.201);
  --primary: oklch(0.5461 0.2152 262.8809);
}

.dark {
  --background: oklch(0.1288 0.0406 264.6952);
  --foreground: oklch(0.9842 0.0034 247.8575);
  --primary: oklch(0.6231 0.188 259.8145);
}
```

**Theme System**:
- Multiple theme variants: `theme-default`, `theme-blue`, `theme-green`, `theme-amber`, `theme-mono`
- Scaled versions: `theme-*-scaled` for compact layouts
- Automatic dark mode switching

### 8. Internationalization (i18n)

**next-intl Configuration**:
```tsx
// Navigation helper
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } = 
  createNavigation(routing)
```

**Supported Locales**: `en` (English), `ar` (Arabic)
**RTL Support**: Automatic direction switching for Arabic

**Locale Detection Strategy**:
1. **New Users**: Browser language detection via `Accept-Language` header
2. **Returning Users**: Saved preference in localStorage
3. **Fallback**: Default to English (`en`)

**Routing Structure**:
- Root URL (`/`) → Server-side redirect based on Accept-Language header detection
- Localized URLs: `/en/*`, `/ar/*`
- `localePrefix: 'always'` ensures locale is always in URL
- No root layout to prevent HTML nesting issues with locale-specific layouts

**Language Persistence**:
```tsx
// Automatic syncing between URL locale and localStorage
useEffect(() => {
  const currentLocale = pathname.split('/')[1] as Language
  if (currentLocale === 'en' || currentLocale === 'ar') {
    setLanguageState(currentLocale)
    localStorage.setItem('language', currentLocale)
  }
}, [pathname])
```

### 9. Authentication (Clerk)

**Provider Setup**:
```tsx
<ClerkProvider
  appearance={{
    baseTheme: resolvedTheme === 'dark' ? dark : undefined
  }}
>
  {children}
</ClerkProvider>
```

**Middleware Configuration**:
```tsx
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/(en|ar)/:path*',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
```

### 10. Error Handling and Monitoring

**Sentry Integration**:
- Conditional setup (can be disabled via `NEXT_PUBLIC_SENTRY_DISABLED`)
- Source map upload for better debugging
- Tunnel route: `/monitoring`
- React component annotation enabled

**Error Boundaries**:
- Global error handling with `global-error.tsx`
- Route-specific error handling with `error.tsx`

## Development Workflow

### 1. Commands and Scripts

```json
{
  "dev": "next dev",
  "build": "next build", 
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "eslint src --fix && pnpm format",
  "format": "prettier --write .",
  "prepare": "husky"
}
```

### 2. Code Quality

**ESLint + Prettier**:
- Strict TypeScript checking
- Prettier for code formatting
- Husky for pre-commit hooks
- Lint-staged for staged file processing

**Pre-commit Hooks**:
```json
{
  "**/*.{js,jsx,tsx,ts,css,less,scss,sass}": [
    "prettier --write --no-error-on-unmatched-pattern"
  ]
}
```

### 3. Environment Configuration

**Required Environment Variables**:
- Database: `DATABASE_URL`
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Sentry: `NEXT_PUBLIC_SENTRY_ORG`, `NEXT_PUBLIC_SENTRY_PROJECT`

## UI/UX Patterns

### 1. Layout Structure

**Dashboard Layout**:
- Collapsible sidebar with persistent state (cookie-based)
- Header with user navigation
- Main content area with proper spacing
- Breadcrumb navigation

**Responsive Design**:
- Mobile-first approach
- Sidebar collapses on mobile
- Grid layouts adapt to screen size

### 2. Command Interface (kbar)

**Usage Pattern**:
```tsx
<KBar>
  {children}
</KBar>
```
- Command+K shortcut
- Integrated theme switching
- Navigation shortcuts

### 3. Data Tables (TanStack Table)

**Features**:
- Server-side filtering, sorting, pagination
- Search params state management with nuqs
- Responsive design
- Export functionality

### 4. Drag and Drop (@dnd-kit)

**Kanban Board Pattern**:
- Accessible drag and drop
- Touch support
- Persistent state with Zustand
- Optimistic updates

## Performance Optimizations

### 1. Next.js Configuration

```tsx
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com'
      }
    ]
  },
  transpilePackages: ['geist']
}
```

### 2. Loading States

- `loading.tsx` files for route-level loading
- Skeleton components for content loading
- Progressive loading patterns

### 3. Bundle Optimization

- Automatic code splitting with Next.js
- Dynamic imports where appropriate
- Tree shaking enabled

## Security Patterns

### 1. Authentication

- Clerk handles all authentication flows
- Server-side session validation
- Protected routes with middleware

### 2. API Security

- Server actions with proper validation
- Input sanitization with Zod
- CSRF protection via Next.js

### 3. Data Validation

**Consistent Validation Pattern**:
```tsx
const schema = z.object({
  field: z.string()
    .min(2, "Minimum length message")
    .max(50, "Maximum length message")
})
```

## Deployment and Production

### 1. Build Configuration

- TypeScript strict mode enabled
- ESLint with strict warnings
- Optimized production builds

### 2. Monitoring

- Sentry for error tracking and performance monitoring
- Source maps for production debugging
- Automatic error reporting

### 3. Database

- PostgreSQL as primary database
- Prisma for type-safe database access
- Migrations with Prisma CLI

## Development Guidelines

### 1. Component Development

- Always use TypeScript
- Implement proper error boundaries
- Follow accessibility guidelines
- Use semantic HTML elements

### 2. State Management

- Use Zustand for client state
- Server state with React Query patterns (if needed)
- Persist important state (user preferences, drafts)

### 3. Performance

- Implement loading states
- Use React.memo() for expensive components
- Optimize images with Next.js Image component
- Implement proper caching strategies

### 4. Testing

- Unit tests for utilities and pure functions
- Integration tests for complex features
- E2E tests for critical user flows

This documentation serves as a comprehensive guide for maintaining consistency and following established patterns throughout the project development lifecycle.
