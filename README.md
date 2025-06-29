# Next.js Supabase Blog

A modern, full-featured blog application built with Next.js 15 and Supabase.

## Features

- ✅ **User Authentication** - Sign up/sign in with email and password
- ✅ **Post Management** - Create, edit, delete, and publish blog posts
- ✅ **Rich Content** - Markdown-style content editing
- ✅ **SEO-Friendly** - Slug-based URLs for better SEO
- ✅ **Comments System** - Readers can comment on posts
- ✅ **User Profiles** - Author profiles with avatars
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Updates** - Powered by Supabase real-time subscriptions
- ✅ **Full-text Search** - PostgreSQL-powered search functionality
- ✅ **Tag System** - Organize posts with tags
- ✅ **Draft/Published States** - Save drafts and publish when ready

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row Level Security

## Database Schema

The application uses the following database structure:

- **profiles** - User profiles linked to auth.users
- **posts** - Blog posts with title, content, slug, and publish status
- **tags** - Post tags for categorization
- **post_tags** - Many-to-many relationship between posts and tags
- **comments** - User comments on posts
- **Full-text search** - PostgreSQL tsvector for searching posts

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nextjs-supabase-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp ..env.example ..env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Apply the SQL schema from `supabase/schemas/full_schema_reset.sql` to your Supabase project
   - This will create all necessary tables, policies, and functions

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router pages
│   ├── dashboard/         # User dashboard and post management
│   ├── login/            # Authentication pages
│   ├── posts/            # Public post listing and individual posts
│   └── layout.tsx        # Root layout with Toaster
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main app layout with navigation
│   └── Navbar.tsx       # Navigation component
└── lib/
    └── supabase/        # Supabase configuration and types
        ├── client.ts    # Browser client
        ├── server.ts    # Server client
        ├── middleware.ts # Auth middleware
        └── database.types.ts # TypeScript types
```

## Features Overview

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes with middleware
- Automatic profile creation on signup

### Blog Management
- Create and edit posts with a clean editor
- Auto-generate slugs from titles
- Draft and publish functionality
- Delete posts with confirmation

### Public Features
- Browse all published posts
- Read individual posts
- View author profiles
- Comment on posts (requires authentication)

### Advanced Features
- Full-text search across post titles and content
- Tag-based post categorization
- Responsive design for mobile and desktop

## Database Policies

The application uses Supabase Row Level Security (RLS) with the following policies:

- **Posts**: Users can CRUD their own posts, everyone can read published posts
- **Comments**: Users can CRUD their own comments, everyone can read all comments
- **Profiles**: Everyone can read profiles, users can update their own
- **Tags**: Everyone can read, authors can manage tags for their posts

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Key Technologies

- **Next.js 15**: Latest features including Server Components and App Router
- **Supabase**: Backend-as-a-Service with PostgreSQL, Auth, and real-time features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Self-hosted**

Make sure to set the environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).