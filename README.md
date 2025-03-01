# Pickleball Matcher

A modern, Vue.js-based application for scheduling and coordinating pickleball matches among groups of players. Pickleball Matcher eliminates the need for complex text chains by providing an intuitive interface for availability management, match coordination, and group communication.

## Features

- **Availability Management**: Set your weekly playing availability with precise hourly slots
- **Smart Match Coordination**: Automated matching based on player availability and preferences
- **Court Coordination**: Rotation-based hosting system for court reservations
- **Group Communication**: Built-in group chat for general announcements and discussions
- **Member Directory**: View all players with their DUPR skill ratings
- **Profile Management**: Set and manage your location preferences and contact information

## Technology Stack

- **Frontend Framework**: Vue.js 3 with Nuxt.js
- **Language**: TypeScript
- **CSS Framework**: Tailwind CSS
- **Icons**: Lucide-Vue-Next
- **Build Tools**: Vite (via Nuxt)

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/pickleball-matcher.git
cd pickleball-matcher
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `https://localhost:3000`

## Key Components

### Dashboard/Matches

The home page displays:

- Upcoming matches requiring confirmation
- Confirmed matches
- Past matches
- Weekly hosting responsibilities
- Important notifications

### Availability Management

Set your availability preferences:

- Weekly frequency preferences
- Specific time slots for each day
- Consecutive day preferences
- Substitute player availability

### Group Management

Access group-specific features:

- Group chat for all members
- Member directory with DUPR ratings
- Group information and settings

### Profile Management

Manage your personal settings:

- Location preferences
- Communication preferences
- Contact information
- DUPR rating display

## Setting up Google Sign-In

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to the Credentials page
4. Create an OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized JavaScript origins: `https://localhost:3000` (for development)
   - Add authorized redirect URIs: `https://localhost:3000` (for development)
5. Copy the Client ID and paste it into your `.env` file as `GOOGLE_CLIENT_ID`

Local dev now requires HTTPS. Use `mkcert` to create local certificates:

_**Note**: Install mkcert using chocolately (Windows) or Homebrew (Mac)_

```
mkcert localhost
```

Note: `nuxt.config.ts` is already set up to use the cert during local dev:

```
export default defineNuxtConfig({
  devServer: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    }
  },
```

Update your `.env` file in the root directory of the project to store google client ID.

```
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Tailwind provides a set of utility classes that you can use directly in your HTML to style your components. To customize your Tailwind setup, you can modify the `tailwind.config.js` file (if you've created one) or add Tailwind-specific configuration to your `nuxt.config.ts` file.

## Icons with Lucide Vue Next

The project includes [Lucide](https://lucide.dev/) for icons. You can use these icons in your Vue components as needed.

## Favicon

To change the title and favicon, update `nuxt.config.ts`. Create your own favicon at https://favicon.io/ and simply drop overtop of the files in the `public` folder.

# Database Configuration

This project uses CockroachDB Cloud as its database backend.

## CockroachDB Cloud Setup

1. Sign up for a CockroachDB Cloud account at [cockroachlabs.cloud](https://cockroachlabs.cloud/)
2. Create a new serverless cluster (free tier available)
3. Create a SQL user with appropriate permissions
4. Download the CA certificate if you plan to use SSL connections
5. Get your connection string from the CockroachDB Cloud Console

## Environment Configuration

Update `.env` file with the following:

```env
DATABASE_URL=postgresql://username:password@hostname:26257/pickleball?sslmode=verify-full&options=--cluster=cluster-name
```

Replace the connection details with those provided by CockroachDB Cloud. The connection string typically looks like:
`postgresql://username:password@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/pickleball?sslmode=verify-full&options=--cluster=cluster-name`

## Database Migrations

This project uses a simple migration system to manage database schema changes.

### Directory Structure

```
/migrations
  /sql
    001-users.sql
    002-matches.sql
    ...
  index.js        # Migration runner
  create.js       # Migration creator helper
```

### Creating a New Migration

To create a new migration file:

```bash
npm run db:create-migration name-of-migration
```

For example:

```bash
npm run db:create-migration create-users-table
```

This will create a new SQL file in the `/migrations/sql` directory with the format `001-create-users-table.sql`. Open this file and add your SQL statements.

### Running Migrations

To apply pending migrations:

```bash
npm run db:migrate
```

This command:

1. Connects to the database using the connection string from your `.env` file
2. Creates a `migrations` table if it doesn't exist
3. Checks which migrations have already been applied
4. Runs any new migrations in order
5. Records successful migrations in the `migrations` table
