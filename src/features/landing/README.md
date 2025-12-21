# Landing Feature

This folder contains all components and logic for the landing/welcome page of SIMAP.

## Structure

```
landing/
├── components/
│   ├── layout/
│   │   ├── LandingHeader.tsx    # Main navigation header
│   │   └── LandingFooter.tsx    # Footer with links and contact info
│   ├── sections/
│   │   ├── HeroSection.tsx      # Hero section with CTA
│   │   ├── RolesSection.tsx     # User roles overview
│   │   ├── FeaturesSection.tsx  # Features showcase
│   │   ├── RelatedAppsSection.tsx # Related applications
│   │   └── AboutSection.tsx     # About school section
│   ├── ui/
│   │   └── ScrollToTopButton.tsx # Scroll to top button
│   └── index.ts                 # Component exports
├── data/
│   ├── features.ts              # Features data and types
│   ├── roles.ts                 # User roles data and types
│   └── apps.ts                  # Related apps data and types
└── pages/
    └── WelcomeScreen.tsx        # Main landing page component
```

## Best Practices Implemented

### 1. **Separation of Concerns**
- **Data**: Separated into `/data` folder with TypeScript interfaces
- **Components**: Organized by purpose (layout, sections, ui)
- **Pages**: Main orchestrator component

### 2. **Component Structure**
- Each component is self-contained and reusable
- Props are properly typed with TypeScript interfaces
- Components follow single responsibility principle

### 3. **Type Safety**
- All data structures have TypeScript interfaces
- Props are properly typed
- No `any` types used

### 4. **Code Organization**
- Related components grouped together
- Clear naming conventions
- Consistent file structure

### 5. **Maintainability**
- Easy to find and update specific sections
- Data changes don't require component modifications
- Components can be reused in other contexts

## Usage

```tsx
import { WelcomeScreen } from '@/features/landing/pages/WelcomeScreen';

// Use in your app
<WelcomeScreen />
```

## Adding New Sections

1. Create a new component in `components/sections/`
2. Add data to appropriate file in `data/` (or create new one)
3. Export from `components/index.ts`
4. Import and use in `WelcomeScreen.tsx`

## Modifying Data

To update features, roles, or apps:
1. Navigate to the appropriate file in `data/`
2. Modify the data array
3. Changes will automatically reflect in the UI
