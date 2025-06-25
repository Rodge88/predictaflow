export type Industry = 'retail' | 'hospitality' | 'waste'

export interface User {
  id: string
  email: string
  name: string
  organization_id: string
  role: 'admin' | 'user' | 'viewer'
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  industry: Industry
  subscription_status: 'trial' | 'active' | 'inactive'
  subscription_plan: 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface DashboardKPI {
  id: string
  title: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'stable'
  unit?: string
  icon?: string
}

export interface PredictionData {
  timestamp: string
  actual: number
  predicted: number
  confidence: number
}

export interface Integration {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  last_sync?: string
  config?: Record<string, any>
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}