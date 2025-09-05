# Design System Documentation

This document explains how to use and customize the design system in this project.

## Overview

The design system is built on a foundation of design tokens that can be easily customized. It follows a hierarchical structure:

1. **Design Tokens**: Base variables defined in `design-tokens.css`
2. **Theme Variables**: Theme-specific variables in `globals.css` and `theme.css`
3. **Component Styles**: Components using the theme variables

## Design Tokens

Design tokens are the foundational variables that define the visual properties of the design system. They are defined in `src/app/[locale]/design-tokens.css`.

### Color Palette

The color system uses the OKLCH color space for better perceptual uniformity and accessibility. Each color has 11 shades (50-950):

- **Primary Colors**: Main brand colors (`--color-primary-*`)
- **Secondary Colors**: Supporting colors (`--color-secondary-*`)
- **Accent Colors**: Highlight colors (`--color-accent-*`)
- **Neutral Colors**: Grayscale colors (`--color-neutral-*`)
- **Success Colors**: Positive feedback colors (`--color-success-*`)
- **Warning Colors**: Cautionary colors (`--color-warning-*`)
- **Danger Colors**: Error/destructive colors (`--color-danger-*`)

### Typography

- `--font-sans`: Main font family
- `--font-serif`: Serif font family
- `--font-mono`: Monospace font family

### Spacing & Sizing

- `--spacing-unit`: Base spacing unit (0.25rem)
- `--radius-base`: Base border radius (0.5rem)

### Effects

- Shadow variables for different elevation levels

## Theme System

The theme system applies design tokens to create consistent visual themes. Themes are defined in:

1. `src/app/[locale]/globals.css`: Base theme variables
2. `src/app/[locale]/theme.css`: Theme variants

### Available Themes

- **Default**: Neutral color scheme
- **Blue**: Blue-based color scheme
- **Green**: Green-based color scheme
- **Amber**: Amber/orange-based color scheme
- **Mono**: Monospace typography with neutral colors

Each theme has both light and dark mode variants.

## Customizing the Design System

### Method 1: Using the Theme Configurator

The easiest way to customize the design system is to use the Theme Configurator component:

1. Import and add the ThemeConfigurator component to your layout:

```tsx

// In your layout component
return (
  <>
    {/* Your existing layout */}
    {/* <ThemeConfigurator /> */}
  </>
);
```

2. Use the UI to customize colors and export your changes.

### Method 2: Editing CSS Files

For more permanent changes, you can directly edit the design token files:

1. Modify `src/app/[locale]/design-tokens.css` to change the base design tokens
2. Update `src/app/[locale]/globals.css` to change how tokens are applied to theme variables
3. Edit `src/app/[locale]/theme.css` to modify specific theme variants

### Method 3: Creating a Custom Theme

To create a new theme:

1. Add a new theme class in `src/app/[locale]/theme.css`:

```css
.theme-custom,
.theme-custom-scaled {
  --primary: var(--color-custom-600);
  --primary-foreground: var(--color-custom-50);
  --secondary: var(--color-custom-200);
  --secondary-foreground: var(--color-custom-800);
  --accent: var(--color-accent-300);
  --accent-foreground: var(--color-accent-900);

  @variant dark {
    --primary: var(--color-custom-500);
    --primary-foreground: var(--color-custom-50);
    --secondary: var(--color-custom-700);
    --secondary-foreground: var(--color-custom-200);
    --accent: var(--color-accent-600);
    --accent-foreground: var(--color-accent-100);
  }
}
```

2. Add your custom color tokens to `design-tokens.css`

## Using the Design System in Components

The design system is integrated with Tailwind CSS. Use Tailwind classes that reference the theme variables:

```tsx
// Example button using theme colors
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>

// Example card using theme colors
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  Card content
</div>
```

## Best Practices

1. **Use Theme Variables**: Always use theme variables (`bg-primary`, `text-foreground`) instead of direct color classes (`bg-blue-500`)
2. **Maintain Contrast Ratios**: Ensure text has sufficient contrast against backgrounds
3. **Be Consistent**: Use the same color for the same purpose across the application
4. **Test in Both Modes**: Always test your UI in both light and dark modes

## Advanced Customization

For advanced customization, you can:

1. Extend the design token system with new token categories
2. Create component-specific theme variables
3. Implement context-based theming for different sections of your application

## Troubleshooting

If your theme changes aren't applying:

1. Check that CSS imports are in the correct order
2. Verify that the theme class is applied to the correct element
3. Inspect the computed CSS variables in browser dev tools
4. Clear browser cache or restart the development server
