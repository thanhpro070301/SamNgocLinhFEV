# Sam Ngọc Linh Website

This is the official web application for Sam Ngọc Linh, a traditional Vietnamese medicinal herb company.

## Core Technologies

- Vue 3 (Composition API)
- Tailwind CSS 
- Vue Router
- Pinia State Management
- Axios for API calls

## Project Structure

```
src/
  ├── api/         # API service layer
  ├── assets/      # Static assets (images, fonts)
  ├── components/  # Reusable Vue components
  │   └── admin/   # Admin-specific components
  ├── composables/ # Vue composables (shared logic)
  ├── layouts/     # Page layouts
  ├── router/      # Vue router configuration
  ├── store/       # Pinia stores
  ├── utils/       # Utility functions
  ├── views/       # Page components
  │   └── admin/   # Admin pages
  └── main.js      # Entry point
```

## Setup

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

## Admin Dashboard

The admin dashboard has been enhanced with modern UI features:

### Design Features

- **Glassmorphism** - Applied to stat cards and UI panels for a modern look
- **Neumorphism** - Used for buttons and interactive elements with subtle shadows 
- **Dark Mode Support** - Full dark mode theme with localStorage persistence
- **Aurora Gradient** - Subtle animated background effects
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Micro-interactions** - Subtle animations and transitions for improved UX

### Components

- `StatCard.vue` - Glassmorphism stat cards with trend indicators
- `ChartCard.vue` - Card component for charts and data visualization
- `NeumorphicButton.vue` - Neumorphic styled buttons with animations
- `RecentOrdersTable.vue` - Enhanced table with tooltips and status badges
- `ProductSummary.vue` - Product stats with visual indicators
- `Sidebar.vue` - Modern sidebar with aurora gradient and user profile
- `Topbar.vue` - Responsive topbar with search and user menu
- `DarkModeToggle.vue` - Toggle for light/dark mode with theme persistence

## Building for Production

```bash
npm run build
```

This will generate optimized production files in the `dist/` directory.

## API Documentation

See `api-docs.md` for API documentation.

## API Configuration

The application uses environment variables to configure the API endpoint:

- For development: `http://localhost:8080/api` (configured in `.env.development`)
- For production: `https://samngoclinh-back.onrender.com/api` (configured in `.env.production`)

You can modify these values in the respective environment files.

## Deployment

The application is configured to be deployed on Netlify.

```bash
# Build and deploy
npm run deploy
```

Make sure you have the Netlify CLI installed:

```bash
npm install -g netlify-cli
```

## Environment Variables

- `VITE_API_URL` - The API endpoint URL 