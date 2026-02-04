# Fur & Co Design System

## Tri-State Ecosystem Architecture

The application uses a unique "Tri-State Ecosystem" that adapts the entire user experience based on three distinct modes:

### 1. GATEWAY (Default State)
- **Theme**: Neutral, White/Black/Minimal
- **Routes**: `/` (Home), `/products`, `/about`, `/blog`, etc.
- **Purpose**: Entry point - clean, accessible, balanced
- **Colors**: Standard whites, blacks, Fur&Co yellow (#FBBF24)

### 2. CORE (Unlimited State)
- **Theme**: High-contrast, Dark Charcoal/Gold
- **Route**: `/unlimited`
- **Purpose**: Premium subscription service focus
- **Colors**: Dark charcoal (#1A1C1E), Gold (#D4AF37)
- **Mood**: Bold, commercial, energetic

### 3. ORIGIN (Niche State)
- **Theme**: Organic, Green/Cream
- **Route**: `/niche`
- **Purpose**: Artisanal products focus
- **Colors**: Light green/cream (#EFF7F2), Deep green (#14522D)
- **Mood**: Story-driven, calm, earthy

## Theme Implementation
- Managed via `ThemeContext.jsx` with `currentMode` state
- CSS variables defined in `index.css` with `[data-theme]` selectors
- Components adapt styling based on active theme
- Smooth transitions between states (500ms ease-in-out)

## Typography
- **Primary**: Lato (sans-serif) - body text, UI elements
- **Secondary**: Playfair Display (serif) - headings, emphasis

## Component Architecture
- Shadcn/ui components as base layer
- Custom components in `/components/common`, `/components/home`, etc.
- Context-aware components (Navbar, Footer) adapt to current theme
- Framer Motion for animations and transitions

## TODO: Document specific color tokens and spacing system
## TODO: Add component usage guidelines
## TODO: Document responsive breakpoints
