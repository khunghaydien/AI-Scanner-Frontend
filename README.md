# Next.js 14 Full-Stack Authentication App

A modern, production-ready Next.js 14 application with comprehensive authentication system, built with TypeScript, React Query, Material-UI, and internationalization support.

## 🚀 Features

### Core Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** with strict configuration
- ✅ **Authentication System** (Sign In, Sign Up, Password Reset, Social Login)
- ✅ **State Management** with React Query
- ✅ **Material-UI v6** with Dark/Light theme
- ✅ **Internationalization** (i18n) with next-intl
- ✅ **Form Validation** with Zod + React Hook Form
- ✅ **Responsive Design**
- ✅ **Testing** with Jest + React Testing Library

### Authentication Features

- 🔐 Email/Password authentication
- 🔐 Social login (Google)
- 🔐 Password reset functionality
- 🔐 Protected routes with Auth Gate
- 🔐 Automatic token refresh
- 🔐 Remember me functionality

### UI/UX Features

- 🎨 Modern Material-UI design system
- 🎨 Dark/Light theme toggle
- 🎨 Responsive layout
- 🎨 Loading states and error handling
- 🎨 Form validation with real-time feedback
- 🎨 Internationalization (English/Vietnamese)

## 🛠 Tech Stack

| Technology            | Version | Purpose              |
| --------------------- | ------- | -------------------- |
| Next.js               | 14.2.32 | React framework      |
| React                 | 18      | UI library           |
| TypeScript            | 5       | Type safety          |
| React Query           | 5.59.0  | State management     |
| Material-UI           | 6.5.0   | UI components        |
| Zod                   | 3.24.2  | Schema validation    |
| React Hook Form       | 7.62.0  | Form management      |
| next-intl             | 4.3.6   | Internationalization |
| Jest                  | Latest  | Testing framework    |
| React Testing Library | Latest  | Component testing    |

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (authenticated)/   # Protected routes
│   ├── (unauthenticated)/ # Public routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── icons/            # Icon components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication feature
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/      # React Query hooks
│   │   └── auth.service.ts # API services
│   └── dashboard/       # Dashboard feature
├── lib/                 # Utility libraries
│   ├── react-query/    # React Query configuration
│   ├── mui/            # Material-UI theme setup
│   ├── i18n/           # Internationalization
│   └── fetchClient.ts  # API client
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd base-nextjs-14
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and hook testing
- **Integration Tests**: Feature testing
- **Mocking**: Next.js router, i18n, Material-UI theme

## 🏗 Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Options

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Docker** (with custom Dockerfile)
- **Traditional hosting** (Node.js server)

## 📚 Learning Resources

### Key Concepts Demonstrated

1. **Modern React Patterns**
   - Custom hooks
   - Context providers
   - Component composition

2. **State Management**
   - React Query hooks
   - Mutations and queries
   - Type-safe data fetching

3. **Authentication Flow**
   - JWT token management
   - Protected routes
   - Social authentication

4. **Form Handling**
   - Validation schemas
   - Error handling
   - Loading states

5. **Internationalization**
   - Dynamic translations
   - Locale switching
   - Message management

### Recommended Learning Path

1. **Week 1**: Next.js App Router, TypeScript setup
2. **Week 2**: React Query, State management
3. **Week 3**: Authentication system, Protected routes
4. **Week 4**: Material-UI, Theming, i18n
5. **Week 5**: Testing, Deployment

## 🔧 Development

### Code Style

- **ESLint**: Configured for Next.js
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/sign-in` - User sign in
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User sign out
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Request/Response Examples

```typescript
// Sign In Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Sign In Response
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Material-UI](https://mui.com/) - React component library
- [React Query](https://tanstack.com/query) - State management
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization

---

**Happy Coding! 🚀**
