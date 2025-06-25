'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Database, 
  Sparkles, 
  Check,
  Upload,
  Link as LinkIcon,
  Loader2,
  ShoppingCart,
  Hotel,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const industries = {
  retail: {
    name: 'Retail',
    icon: ShoppingCart,
    dataSources: ['POS Systems', 'Inventory Management', 'E-commerce Platforms', 'CRM Systems'],
    kpis: ['Sales Revenue', 'Inventory Turnover', 'Customer Retention', 'Average Order Value'],
  },
  hospitality: {
    name: 'Hospitality',
    icon: Hotel,
    dataSources: ['Property Management Systems', 'Booking Engines', 'Guest Reviews', 'Revenue Management'],
    kpis: ['Occupancy Rate', 'RevPAR', 'Guest Satisfaction', 'Average Daily Rate'],
  },
  waste: {
    name: 'Waste Management',
    icon: Trash2,
    dataSources: ['Fleet Management', 'Route Planning', 'Waste Tracking', 'Customer Management'],
    kpis: ['Collection Efficiency', 'Route Optimization', 'Fuel Consumption', 'Customer Satisfaction'],
  },
}

const steps = [
  { id: 1, title: 'Organization Details', icon: Building2 },
  { id: 2, title: 'Team Setup', icon: Users },
  { id: 3, title: 'Data Sources', icon: Database },
  { id: 4, title: 'Finish Setup', icon: Sparkles },
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const industryParam = searchParams.get('industry') as keyof typeof industries
  const industry = industries[industryParam] || industries.retail

  const [formData, setFormData] = useState({
    organizationName: '',
    teamSize: '',
    inviteEmails: ['', '', ''],
    selectedDataSources: [] as string[],
    uploadedFile: null as File | null,
  })

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleDataSource = (source: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDataSources: prev.selectedDataSources.includes(source)
        ? prev.selectedDataSources.filter(s => s !== source)
        : [...prev.selectedDataSources, source]
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Acme Corporation"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <select
                id="teamSize"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.teamSize}
                onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
              >
                <option value="">Select team size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Industry</Label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <industry.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{industry.name}</span>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Invite team members to collaborate (optional)
            </p>
            {formData.inviteEmails.map((email, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`email-${index}`}>Team Member {index + 1}</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => {
                    const newEmails = [...formData.inviteEmails]
                    newEmails[index] = e.target.value
                    setFormData(prev => ({ ...prev, inviteEmails: newEmails }))
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                inviteEmails: [...prev.inviteEmails, ''] 
              }))}
            >
              Add Another
            </Button>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Connect your data sources to start generating insights
            </p>
            
            <div className="grid gap-3">
              {industry.dataSources.map((source) => (
                <Card
                  key={source}
                  className={`cursor-pointer transition-all ${
                    formData.selectedDataSources.includes(source)
                      ? 'ring-2 ring-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleDataSource(source)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{source}</span>
                    </div>
                    {formData.selectedDataSources.includes(source) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Or upload sample data to try PredictaFlow
              </p>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your CSV or Excel file here
                </p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">You're all set!</h3>
              <p className="text-muted-foreground">
                Let's dive into your personalized dashboard
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Your Setup Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Organization</span>
                  <span className="font-medium">{formData.organizationName || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{industry.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-medium">{formData.teamSize || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Sources</span>
                  <span className="font-medium">{formData.selectedDataSources.length} connected</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Here's what happens next:
              </p>
              <div className="grid gap-2 text-left max-w-sm mx-auto">
                {[
                  'View your personalized dashboard',
                  'Explore predictive insights',
                  'Set up automated alerts',
                  'Invite more team members',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-3xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to PredictaFlow
            </h1>
            <p className="text-muted-foreground">
              Let's get your account set up in just a few steps
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 dark:bg-gray-700" />
              <div 
                className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`relative z-10 flex flex-col items-center ${
                    step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.id <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your organization"}
                {currentStep === 2 && "Build your team"}
                {currentStep === 3 && "Connect your data"}
                {currentStep === 4 && "Review and launch"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'invisible' : ''}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : currentStep === steps.length ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}