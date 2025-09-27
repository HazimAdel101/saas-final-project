# Loading System Documentation

This project now includes a comprehensive loading system that shows up immediately when users open the project, addressing the issue of late-loading states.

## Components

### 1. `InitialLoader` (`src/components/initial-loader.tsx`)
- Basic loader component with spinner, text, and progress bar
- Includes a minimal variant for quick loading scenarios
- Uses CSS animations for smooth transitions

### 2. `EnhancedLoading` (`src/components/enhanced-loading.tsx`)
- Advanced loader with multiple variants: `default`, `minimal`, `splash`
- Configurable message, duration, and progress display
- Smooth animations and transitions

### 3. `LoadingProvider` (`src/components/loading-provider.tsx`)
- Context provider for managing global loading state
- Wraps the entire application to show initial loader
- Configurable loader type and settings

### 4. `useInitialLoading` (`src/hooks/use-initial-loading.ts`)
- Custom hook for managing loading state
- Handles hydration and minimum loading time
- Provides loading state to components

## Usage

### Basic Usage
The loader is automatically integrated into the root layout and will show when the app starts loading.

### Custom Configuration
You can customize the loader by modifying the `LoadingProvider` in `src/app/[locale]/layout.tsx`:

```tsx
<LoadingProvider
  loaderType="splash"           // 'default' | 'minimal' | 'splash'
  loadingMessage="Welcome!"     // Custom message
  loadingDuration={2000}        // Duration in milliseconds
>
  {children}
</LoadingProvider>
```

### Manual Usage
For specific components or pages, you can use the loader directly:

```tsx
import EnhancedLoading from '@/components/enhanced-loading'

// In your component
<EnhancedLoading
  variant="default"
  message="Loading data..."
  duration={1500}
  showProgress={true}
/>
```

## Variants

### Default
- Medium-sized spinner with text and progress bar
- Best for general loading scenarios
- Duration: 1000ms

### Minimal
- Small spinner only
- Best for quick operations
- Duration: 500ms

### Splash
- Large spinner with prominent text
- Best for initial app loading
- Duration: 2000ms

## CSS Animations

The system includes custom CSS animations in `src/app/[locale]/globals.css`:
- `pulse-glow`: Pulsing effect for the spinner
- `fade-in-up`: Smooth entrance animation
- `shimmer`: Progress bar shimmer effect

## Features

- ✅ Shows immediately when app starts
- ✅ Smooth fade-in/fade-out transitions
- ✅ Configurable duration and messages
- ✅ Multiple visual variants
- ✅ Progress indication
- ✅ Responsive design
- ✅ Theme-aware (light/dark mode)
- ✅ TypeScript support
- ✅ Accessibility friendly

## Integration

The loader is integrated at the root level in `src/app/[locale]/layout.tsx` and will automatically show when:
1. The app is initially loading
2. The page is hydrating
3. The minimum loading time hasn't been reached

This ensures users see immediate feedback when opening the project, eliminating the late-loading issue.
