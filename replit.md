# Education Platform - ProfPlus

## Overview

ProfPlus is a comprehensive educational platform designed to help students learn various subjects through interactive courses and exercises. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage
- **Build Process**: ESBuild for server-side bundling

### Directory Structure
```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions and API client
├── server/          # Express backend application
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Database operations interface
│   └── vite.ts      # Development server setup
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database schema and types
└── migrations/      # Database migration files
```

## Key Components

### Database Schema
The application uses a comprehensive schema with the following entities:
- **Users**: Student profiles with grades, points, and streaks
- **Subjects**: Academic subjects (Math, French, Physics, Chemistry, History, English)
- **Courses**: Structured learning content within subjects
- **Exercises**: Interactive activities (QCM, classification, essays)
- **User Progress**: Tracking student advancement through courses
- **Exercise Results**: Recording student performance on exercises
- **Daily Stats**: Aggregated daily learning metrics
- **Appointments**: Scheduled sessions with teachers

### API Endpoints
- `GET /api/user` - Get current user profile
- `GET /api/subjects` - List all available subjects
- `GET /api/user/:userId/progress` - Get user's learning progress
- `GET /api/user/:userId/stats/:date` - Get daily statistics
- `POST /api/exercises/:exerciseId/submit` - Submit exercise answers

### Exercise Types
1. **QCM (Multiple Choice)**: Traditional multiple-choice questions
2. **Classification**: Drag-and-drop categorization activities
3. **Essay**: Open-ended written responses

## Data Flow

1. **User Authentication**: Currently uses a fixed user ID (1) for demo purposes
2. **Course Navigation**: Users browse subjects and select courses by slug
3. **Exercise Interaction**: Students complete exercises and submit answers
4. **Progress Tracking**: System records completion and scores
5. **Statistics**: Daily metrics are aggregated and displayed on dashboard

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **HTTP Client**: Fetch API with TanStack Query for caching
- **Form Validation**: Zod schemas with React Hook Form
- **Date Handling**: date-fns library
- **Icons**: Lucide React icons

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with nodemon-like reloading
- **Database**: Neon Database with connection pooling
- **Build Process**: Parallel frontend and backend builds

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Serving**: Express serves built frontend files
- **Database**: Production Neon Database instance

### Key Configuration
- **Database URL**: Required environment variable for Neon connection
- **Build Commands**: Separate dev/build/start scripts
- **TypeScript**: Strict mode enabled with path mapping
- **Tailwind**: Custom theme with subject-specific colors

The application is designed for educational institutions wanting to provide interactive learning experiences with progress tracking and teacher-student interaction capabilities.