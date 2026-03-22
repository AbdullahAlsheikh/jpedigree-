# Pedigree SaaS - Genetic Pedigree Tool

A scalable React + TypeScript + Material-UI application for creating and managing genetic pedigree diagrams.

## Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Zustand** for state management (with Immer for immutability)
- **Vite** for build tooling
- **SVG** for scalable rendering

### Project Structure

```
pedigree-saas/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── PedigreeCanvas.tsx       # Main SVG canvas
│   │   │   ├── IndividualSymbol.tsx     # Individual rendering
│   │   │   ├── PartnershipLine.tsx      # Partnership connections
│   │   │   └── ConnectionLine.tsx       # Parent-child connections
│   │   ├── Panels/
│   │   │   ├── Toolbar.tsx              # Top toolbar with modes
│   │   │   ├── DiseasePanel.tsx         # Disease management panel
│   │   │   └── LegendPanel.tsx          # Symbol legend
│   │   └── Modals/                      # Future modals
│   ├── store/
│   │   └── pedigreeStore.ts             # Zustand store
│   ├── types/
│   │   └── pedigree.types.ts            # TypeScript types
│   ├── App.tsx                          # Main app component
│   └── main.tsx                         # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Features

### Current Features
- ✅ Add individuals (male/female)
- ✅ Create partnerships between individuals
- ✅ Add children to partnerships
- ✅ Multiple disease tracking with color coding
- ✅ Drag mode to reposition individuals
- ✅ Delete mode to remove individuals/partnerships
- ✅ Auto-layout algorithm for organizing pedigrees
- ✅ Labels/names for individuals
- ✅ Zoom and pan controls
- ✅ Undo functionality
- ✅ SVG-based rendering (scalable)

### Planned Features
- 🔲 User authentication (Auth0/Supabase)
- 🔲 Save/load pedigrees to database
- 🔲 Export to PDF/PNG/SVG
- 🔲 GEDCOM import/export
- 🔲 Real-time collaboration
- 🔲 Inheritance pattern analysis
- 🔲 Version history
- 🔲 Sharing & permissions
- 🔲 Templates library
- 🔲 Mobile responsive design

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The app will run on `http://localhost:3000`

### State Management

Using Zustand with Immer middleware for clean, immutable state updates:

```typescript
// Example: Adding an individual
const { addIndividual } = usePedigreeStore();
addIndividual({
  id: Date.now().toString(),
  x: 100,
  y: 100,
  sex: 'male',
  label: 'John',
  diseases: [],
  affected: false,
});
```

### Component Architecture

- **Separation of Concerns**: Canvas logic separated from UI panels
- **Type Safety**: Full TypeScript coverage
- **Immutable State**: Zustand + Immer prevents state bugs
- **SVG Rendering**: Scalable graphics that work at any zoom level

## Next Steps for SaaS

### Phase 1: Backend Integration
1. Set up Next.js API routes or standalone backend (FastAPI/NestJS)
2. Add PostgreSQL database with Prisma ORM
3. Implement user authentication
4. Create REST/GraphQL API for CRUD operations

### Phase 2: Multi-tenancy
1. Organization/team support
2. User roles & permissions
3. Pedigree sharing functionality
4. Billing integration (Stripe)

### Phase 3: Advanced Features
1. Real-time collaboration (WebSockets/Supabase Realtime)
2. AI-powered inheritance analysis
3. Integration with genetic testing APIs
4. Mobile apps (React Native)

## Technology Decisions

### Why Zustand over Redux?
- Simpler API, less boilerplate
- Better TypeScript support
- Smaller bundle size
- Easier to learn and maintain

### Why SVG over Canvas?
- Scalable at any zoom level
- Better accessibility
- Easier to interact with individual elements
- Can export directly to SVG files

### Why Material-UI?
- Professional, enterprise-ready components
- Comprehensive theming system
- Excellent TypeScript support
- Active maintenance and community

### Why Vite over Create-React-App?
- Faster dev server (HMR)
- Better build performance
- Modern defaults
- Better tree-shaking

## Contributing

This is a scalable foundation ready for:
- Backend integration
- Database persistence
- Multi-user support
- Production deployment

## License

MIT
