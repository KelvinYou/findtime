# Find Time Frontend

A modern React application for scheduling and meeting coordination, built with a focus on internationalization and beautiful UI components.

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lingui** - Internationalization (i18n) framework
- **Lucide React** - Beautiful icons
- **Nx** - Monorepo build system

## Features

- 🌍 **Multi-language Support** - English, Spanish, and French
- 🎨 **Modern UI** - Beautiful, responsive design with shadcn/ui components
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Development** - Hot reload with Vite
- 🎯 **Type Safety** - Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:4200`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Main application components
│   └── app.tsx         # Root App component
├── components/         # Reusable UI components
│   └── ui/            # shadcn/ui components
│       ├── button.tsx
│       └── card.tsx
├── lib/               # Utility functions
│   └── utils.ts       # shadcn/ui utilities
├── locales/           # Internationalization files
│   ├── en/
│   ├── es/
│   └── fr/
└── styles.css         # Global styles and Tailwind imports
```

## Internationalization

The application supports three languages:
- **English (en)** - Default language
- **Spanish (es)** - Español
- **French (fr)** - Français

Language switching is available via the header buttons. The translations are managed through a simple translation object in the App component.

## UI Components

The application uses shadcn/ui components for a consistent and beautiful design:

- **Button** - Various button styles and sizes
- **Card** - Content containers with headers, content, and footers
- **Typography** - Consistent text styling

## Styling

The application uses Tailwind CSS with a custom design system that includes:

- CSS custom properties for theming
- Dark mode support (ready for implementation)
- Responsive design utilities
- Custom color palette

## Development

### Adding New Components

1. Create new components in `src/components/`
2. Use shadcn/ui patterns for consistency
3. Import and use the `cn` utility for class merging

### Adding New Languages

1. Add translations to the `translations` object in `app.tsx`
2. Update the locale type definition
3. Add language button to the header

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Ensure components are accessible
4. Test on multiple screen sizes
5. Update translations for all supported languages

## License

MIT License - see the main project LICENSE file for details. 