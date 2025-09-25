# Skunk Tales - Cozy AI Adventures

## Overview

Skunk Tales is a cozy AI-powered tabletop role-playing game (TTRPG) built as a mobile-first web application. The game features an intelligent AI companion that creates dynamic storylines, manages adventures, and guides players through magical worlds. Players interact through a chat interface while managing their character, quests, and inventory through dedicated mobile-optimized screens.

The application combines the immersive storytelling of traditional tabletop gaming with modern mobile gaming UI patterns, featuring real-time AI responses, character progression, and persistent adventure state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Styling**: Tailwind CSS with custom design system inspired by gaming apps like Genshin Impact and D&D Beyond
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **State Management**: TanStack Query for server state management and caching
- **Mobile-First Design**: Responsive design with bottom navigation tabs optimized for mobile interaction

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-5 for intelligent game master functionality
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Build System**: Vite for fast development and optimized production builds

### Data Models
- **Character System**: D&D-style attributes (strength, dexterity, constitution, intelligence, wisdom, charisma) with health/mana tracking
- **Quest Management**: Hierarchical quest system with progress tracking, priorities, and quest chains
- **Inventory System**: Item management with types (weapon, armor, consumable, misc) and rarity levels
- **Combat System**: Turn-based combat with enemy management and game state tracking
- **Message History**: Persistent chat logs with support for DM, player, and NPC messages

### Game Logic
- **AI Adventure Guide**: Contextual responses based on character stats, current quests, and game state
- **Dynamic Story Generation**: AI-driven adventure creation and progression
- **Character Management**: Automated character progression with meaningful choices
- **Adventure State Persistence**: Continuous save system maintaining all adventure progress

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with schema validation
- **OpenAI API**: GPT-5 integration for AI adventure guide functionality
- **@tanstack/react-query**: Client-side data fetching and caching

### UI/UX Libraries
- **@radix-ui/***: Accessible component primitives for modals, dropdowns, navigation
- **class-variance-authority**: Type-safe variant management for component styling
- **tailwindcss**: Utility-first CSS framework with custom gaming theme
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **typescript**: Static type checking across frontend and backend
- **vite**: Fast build tool with hot module replacement
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database schema management and migrations

### Fonts and Assets
- **Google Fonts**: Inter for UI text, Cinzel for fantasy-themed headings
- Custom color palette with dark mode primary theme and fantasy gaming aesthetics