# PredictaFlow - AI-Powered Predictive Analytics SaaS

A comprehensive, production-ready predictive analytics SaaS platform built with Next.js 14, TypeScript, and modern UI components. PredictaFlow provides industry-specific dashboards for retail, hospitality, and waste management sectors with real-time insights and AI-powered predictions.

## 🚀 Features

### Core Functionality
- **Industry-Specific Dashboards**: Tailored analytics for retail, hospitality, and waste management
- **Real-Time Data Visualization**: Interactive charts with Recharts integration
- **Predictive Analytics**: AI-powered forecasting with confidence intervals
- **Data Integration Hub**: Connect multiple data sources with visual status indicators
- **Team Collaboration**: Multi-user support with role-based permissions
- **Responsive Design**: Mobile-first approach with full desktop support

### User Experience
- **Intuitive Onboarding**: 4-step guided setup wizard
- **Industry Selection**: Smart industry detection and customization
- **Interactive Landing Page**: Animated components with smooth transitions
- **Comprehensive Authentication**: Login, signup, password reset, and social auth
- **Advanced Settings**: Profile management, team settings, billing integration

### Technical Features
- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Component Library**: shadcn/ui with custom components
- **State Management**: React hooks with form validation
- **Error Handling**: Comprehensive error boundaries and 404 pages
- **Performance**: Optimized loading states and smooth animations
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Database**: Supabase (configured)
- **Authentication**: Supabase Auth (configured)
- **Payments**: Stripe (configured)
- **Email**: Resend (configured)

## 📁 Project Structure

```
predictaflow/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── onboarding/
│   ├── (dashboard)/            # Dashboard pages
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── integrations/
│   │   └── settings/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx               # Landing page
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                    # Base UI components
│   ├── charts/                # Chart components
│   ├── dashboard/             # Dashboard-specific components
│   ├── integrations/          # Integration components
│   └── landing/               # Landing page components
├── lib/
│   ├── supabase/             # Database configuration
│   ├── utils.ts              # Utility functions
│   └── mock-data/            # Sample data for demos
├── types/
│   └── index.ts              # TypeScript definitions
└── public/                   # Static assets
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd predictaflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 User Flows

### Landing Page → Dashboard
1. **Landing Page**: Industry selection and feature showcase
2. **Sign Up**: Account creation with industry preferences
3. **Onboarding**: 4-step wizard (organization, team, data sources, completion)
4. **Dashboard**: Industry-specific analytics with real-time data

### Authentication Flow
- **Login**: Email/password with social auth options
- **Sign Up**: Multi-step registration with password strength validation
- **Password Reset**: Email-based recovery system
- **Session Management**: Secure session handling with logout

### Dashboard Navigation
- **Overview**: Key metrics and trend analysis
- **Analytics**: Advanced predictions and model performance
- **Integrations**: Data source management and API connections
- **Settings**: Profile, team, billing, and security management

## 📊 Industry Dashboards

### Retail Analytics
- **KPIs**: Revenue, Units Sold, Average Order Value, Inventory Turnover
- **Charts**: Sales trends, top products, category breakdown
- **Features**: Inventory alerts, demand forecasting, price optimization

### Hospitality Intelligence
- **KPIs**: Occupancy Rate, ADR, RevPAR, Guest Satisfaction
- **Charts**: Occupancy trends, room type performance, revenue channels
- **Features**: Event impact analysis, pricing optimization, satisfaction tracking

### Waste Management
- **KPIs**: Collection Efficiency, Fuel Consumption, Route Optimization, Customer Satisfaction
- **Charts**: Volume trends, waste type distribution, route performance
- **Features**: Maintenance alerts, route optimization, environmental impact tracking

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting (configured)
- **Component Structure**: Modular, reusable components

### Performance Optimizations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and data loading
- **Caching**: Optimized API calls and static assets

## 🎨 Design System

### Colors
- **Primary**: Gradient from primary to pink (346.8° 77.2% 49.8%)
- **Secondary**: Neutral grays for backgrounds and text
- **Semantic**: Green (success), Red (error), Yellow (warning)

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body**: Readable, consistent line heights
- **Code**: Monospace fonts for technical content

### Components
- **Consistent Spacing**: 4px grid system
- **Border Radius**: Consistent rounded corners
- **Shadows**: Subtle depth indicators
- **Animations**: Smooth transitions and micro-interactions

## 🔒 Security & Privacy

- **Authentication**: Secure session management
- **Data Protection**: Environment variable configuration
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Graceful error boundaries
- **Access Control**: Role-based permissions

## 📈 Features Showcase

### Interactive Elements
- ✅ All buttons are clickable with proper hover states
- ✅ All forms submit with validation
- ✅ All navigation links work
- ✅ Charts are interactive with tooltips and drill-down
- ✅ Responsive design across all devices

### Data Visualization
- ✅ Line charts for trends and predictions
- ✅ Bar charts for comparisons
- ✅ Pie charts for distributions
- ✅ Area charts for cumulative data
- ✅ Interactive tooltips and legends

### User Experience
- ✅ Smooth page transitions
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Accessible design with keyboard navigation
- ✅ Mobile-responsive layouts

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**PredictaFlow** - Transform your business with AI-powered predictions. From retail inventory to hospitality management, make data-driven decisions with confidence.