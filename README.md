# Pedigree SaaS - Genetic Pedigree Tool

## Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Zustand** for state management (with Immer for immutability)
- **Vite** for build tooling
- **SVG** for scalable rendering

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

<!-- ## Contributing

This is a scalable foundation ready for:

- Backend integration
- Database persistence
- Multi-user support
- Production deployment -->

## License

MIT
