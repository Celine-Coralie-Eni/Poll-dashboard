# 📊 Poll Dashboard

A full-stack Poll & Results Dashboard web application built with Next.js, featuring real-time voting, multilingual support, and advanced analytics.

## ✨ Features

- **🎯 Poll Creation & Management**: Create polls with multiple options and manage them through an admin interface
- **🗳️ Real-time Voting**: Vote on polls with instant result updates
- **🔒 Secure Voting**: Prevent duplicate votes using session/IP tracking
- **🌐 Multilingual Support**: Full internationalization with Tolgee and inline translation editing
- **📊 Real-time Results**: Live poll results with percentage calculations and visual progress bars
- **👥 User Authentication**: Secure login/registration system with role-based access
- **🎨 Modern UI**: Beautiful interface built with Tailwind CSS and DaisyUI
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🔧 Admin Dashboard**: Comprehensive admin panel for managing polls and users
- **📈 Analytics**: Detailed insights and export capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Database**: MariaDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Internationalization**: Tolgee
- **Deployment**: Docker, Vercel
- **Development**: Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd poll-dashboard
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL="mysql://poll_user:poll_password@localhost:3306/poll_dashboard"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Tolgee Configuration (Optional)
TOLGEE_API_KEY="your-tolgee-api-key"
TOLGEE_API_URL="https://app.tolgee.io"

# Application Configuration
NODE_ENV="development"
```

### 3. Start with Docker Compose

```bash
# Start the application and database
npm run docker:up

# Or manually
docker-compose up -d
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Access the Application

Open your browser and navigate to: http://localhost:3000

### Demo Credentials

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 📁 Project Structure

```
poll-dashboard/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── polls/             # Poll-related pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets and translations
├── docker-compose.yml    # Docker configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio

# Docker
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
```

### Adding New Translations

1. Add new keys to `public/locales/en.json`
2. Create corresponding files for other languages
3. Use the `useTranslations` hook in your components:

```tsx
import { useTranslations } from "@tolgee/react";

export function MyComponent() {
  const { t } = useTranslations();
  return <h1>{t("my.translation.key")}</h1>;
}
```

### Database Schema

The application uses the following main entities:

- **User**: Authentication and user management
- **Poll**: Poll questions and metadata
- **Option**: Poll options/choices
- **Vote**: Individual votes with duplicate prevention

## 🌐 Internationalization

The application supports multiple languages through Tolgee:

- **Inline Translation**: Edit translations directly in the UI during development
- **Static Files**: Fallback to local JSON files
- **Dynamic Loading**: Load translations from Tolgee platform

### Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
TOLGEE_API_KEY="your-tolgee-api-key"
TOLGEE_API_URL="https://app.tolgee.io"
```

### Database Setup

For production, you can use:

- **PlanetScale** (MySQL-compatible)
- **Railway** (MariaDB)
- **AWS RDS** (MariaDB)
- **DigitalOcean Managed Databases**

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: Secure session handling with NextAuth
- **Duplicate Vote Prevention**: IP and session-based tracking
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in NextAuth protection
- **Rate Limiting**: API endpoint protection

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Polls

- `GET /api/polls` - List all polls
- `POST /api/polls` - Create new poll
- `GET /api/polls/[id]` - Get specific poll
- `PUT /api/polls/[id]` - Update poll (admin only)
- `DELETE /api/polls/[id]` - Delete poll (admin only)
- `POST /api/polls/[id]/vote` - Submit vote

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [DaisyUI](https://daisyui.com/) - Component library
- [Prisma](https://prisma.io/) - Database ORM
- [Tolgee](https://tolgee.io/) - Internationalization platform
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Polling! 🎉**
