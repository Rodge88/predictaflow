'use client'

import { useState } from 'react'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Hotel, 
  Trash2, 
  TrendingUp, 
  BarChart3, 
  Clock,
  Users,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const industries = [
  {
    id: 'retail',
    title: 'Retail Analytics',
    description: 'Optimize inventory, predict demand, and maximize revenue',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Inventory level predictions',
      'Demand forecasting',
      'Customer behavior analysis',
      'Price optimization'
    ],
    metrics: {
      reduction: '35%',
      metric: 'inventory costs',
      improvement: '28%',
      area: 'sales forecasting'
    }
  },
  {
    id: 'hospitality',
    title: 'Hospitality Intelligence',
    description: 'Forecast occupancy, optimize pricing, and enhance guest experience',
    icon: Hotel,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Occupancy rate predictions',
      'Revenue management',
      'Guest satisfaction tracking',
      'Staff optimization'
    ],
    metrics: {
      reduction: '40%',
      metric: 'vacant rooms',
      improvement: '32%',
      area: 'revenue per room'
    }
  },
  {
    id: 'waste',
    title: 'Waste Management',
    description: 'Optimize routes, predict volumes, and reduce operational costs',
    icon: Trash2,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Route optimization',
      'Volume predictions',
      'Cost efficiency tracking',
      'Environmental impact'
    ],
    metrics: {
      reduction: '25%',
      metric: 'collection costs',
      improvement: '30%',
      area: 'route efficiency'
    }
  }
]

const features = [
  {
    icon: TrendingUp,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning models trained on industry-specific data'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live dashboards with actionable insights and trend analysis'
  },
  {
    icon: Clock,
    title: 'Automated Workflows',
    description: 'Set up alerts and automated actions based on predictions'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share insights and reports with your entire organization'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with industry standards'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process millions of data points in real-time'
  }
]

const plans = [
  {
    name: 'Starter',
    price: '$299',
    description: 'Perfect for small businesses',
    features: [
      'Up to 3 users',
      'Basic analytics dashboard',
      '1 data source integration',
      'Email support',
      '30-day data retention'
    ]
  },
  {
    name: 'Professional',
    price: '$799',
    description: 'For growing companies',
    features: [
      'Up to 20 users',
      'Advanced analytics & ML',
      '5 data source integrations',
      'Priority support',
      '1 year data retention',
      'Custom reports',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'Custom ML models',
      'Unlimited integrations',
      'Dedicated support',
      'Unlimited data retention',
      'On-premise option',
      'SLA guarantee',
      'Custom training'
    ]
  }
]

export default function LandingPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                PredictaFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#industries" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Industries
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t"
            >
              <div className="px-4 py-4 space-y-2">
                <Link href="#features" className="block py-2 text-gray-600 dark:text-gray-300">Features</Link>
                <Link href="#industries" className="block py-2 text-gray-600 dark:text-gray-300">Industries</Link>
                <Link href="#pricing" className="block py-2 text-gray-600 dark:text-gray-300">Pricing</Link>
                <Link href="/login" className="block py-2">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="block py-2">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            Predictive Analytics
            <br />
            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Transform your business with AI-powered predictions. From retail inventory to hospitality management, 
            make data-driven decisions with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Selection */}
      <section id="industries" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Industry</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tailored solutions for your specific business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedIndustry === industry.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedIndustry(industry.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-5`} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <industry.icon className="h-12 w-12 text-primary" />
                      {selectedIndustry === industry.id && (
                        <Check className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{industry.title}</CardTitle>
                    <CardDescription className="text-base">
                      {industry.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {industry.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Average reduction in {industry.metrics.metric}:</span>
                        <span className="font-bold text-primary">{industry.metrics.reduction}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600 dark:text-gray-400">Improvement in {industry.metrics.area}:</span>
                        <span className="font-bold text-primary">{industry.metrics.improvement}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedIndustry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <Link href={`/signup?industry=${selectedIndustry}`}>
                <Button size="lg">
                  Get Started with {industries.find(i => i.id === selectedIndustry)?.title}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to make data-driven decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that fits your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-gray-600 dark:text-gray-400">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/signup?plan=${plan.name.toLowerCase()}`}>
                      <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-pink-600 text-white border-0">
            <CardContent className="text-center py-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of companies making smarter decisions with PredictaFlow
              </p>
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PredictaFlow</h3>
              <p className="text-gray-400">
                AI-powered predictive analytics for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PredictaFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}