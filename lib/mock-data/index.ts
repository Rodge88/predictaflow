import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import type { Industry, DashboardKPI, PredictionData, ChartData } from '@/types'

// Generate time series data
const generateTimeSeriesData = (days: number, baseValue: number, volatility: number = 0.1) => {
  const data: PredictionData[] = []
  const startDate = subDays(new Date(), days)
  
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - i)
    const trend = baseValue * (1 + (i / days) * 0.2) // 20% growth trend
    const noise = (Math.random() - 0.5) * volatility * baseValue
    const actual = Math.max(0, trend + noise)
    const predicted = actual * (0.95 + Math.random() * 0.1) // Prediction within 5% accuracy
    
    data.push({
      timestamp: format(date, 'yyyy-MM-dd'),
      actual: Math.round(actual * 100) / 100,
      predicted: Math.round(predicted * 100) / 100,
      confidence: 0.85 + Math.random() * 0.15
    })
  }
  
  return data
}

// Retail mock data
export const retailData = {
  kpis: [
    {
      id: '1',
      title: 'Revenue',
      value: '$847,329',
      change: 12.5,
      trend: 'up' as const,
      unit: '$',
      icon: 'dollar-sign'
    },
    {
      id: '2',
      title: 'Units Sold',
      value: '23,467',
      change: 8.2,
      trend: 'up' as const,
      unit: 'units'
    },
    {
      id: '3',
      title: 'Avg Order Value',
      value: '$67.43',
      change: -2.1,
      trend: 'down' as const,
      unit: '$'
    },
    {
      id: '4',
      title: 'Inventory Turnover',
      value: '4.2x',
      change: 15.3,
      trend: 'up' as const,
      unit: 'x'
    }
  ] as DashboardKPI[],
  
  salesTrend: generateTimeSeriesData(30, 25000),
  
  topProducts: [
    { name: 'Wireless Headphones', value: 1250, change: 15.2 },
    { name: 'Smart Watch', value: 987, change: 8.7 },
    { name: 'Laptop Stand', value: 743, change: -2.3 },
    { name: 'USB-C Hub', value: 621, change: 22.1 },
    { name: 'Bluetooth Speaker', value: 534, change: 5.9 }
  ] as ChartData[],
  
  categoryBreakdown: [
    { name: 'Electronics', value: 42, fill: '#3b82f6' },
    { name: 'Accessories', value: 28, fill: '#ef4444' },
    { name: 'Home & Garden', value: 18, fill: '#10b981' },
    { name: 'Clothing', value: 12, fill: '#f59e0b' }
  ] as ChartData[],
  
  inventoryAlerts: [
    { product: 'iPhone Cases', currentStock: 23, reorderPoint: 50, urgency: 'high' },
    { product: 'Laptop Chargers', currentStock: 67, reorderPoint: 100, urgency: 'medium' },
    { product: 'Wireless Mice', currentStock: 89, reorderPoint: 120, urgency: 'medium' }
  ]
}

// Hospitality mock data
export const hospitalityData = {
  kpis: [
    {
      id: '1',
      title: 'Occupancy Rate',
      value: '78.5%',
      change: 5.2,
      trend: 'up' as const,
      unit: '%'
    },
    {
      id: '2',
      title: 'ADR',
      value: '$189.43',
      change: 3.1,
      trend: 'up' as const,
      unit: '$'
    },
    {
      id: '3',
      title: 'RevPAR',
      value: '$148.71',
      change: 8.7,
      trend: 'up' as const,
      unit: '$'
    },
    {
      id: '4',
      title: 'Guest Satisfaction',
      value: '4.6/5',
      change: 2.3,
      trend: 'up' as const,
      unit: '/5'
    }
  ] as DashboardKPI[],
  
  occupancyTrend: generateTimeSeriesData(30, 0.75).map(d => ({
    ...d,
    actual: d.actual > 1 ? 1 : d.actual,
    predicted: d.predicted > 1 ? 1 : d.predicted
  })),
  
  roomTypes: [
    { name: 'Standard', value: 145, change: 8.2 },
    { name: 'Deluxe', value: 89, change: 12.1 },
    { name: 'Suite', value: 34, change: -5.3 },
    { name: 'Executive', value: 28, change: 15.7 }
  ] as ChartData[],
  
  revenueChannels: [
    { name: 'Direct Booking', value: 45, fill: '#3b82f6' },
    { name: 'OTA', value: 32, fill: '#ef4444' },
    { name: 'Corporate', value: 15, fill: '#10b981' },
    { name: 'Travel Agents', value: 8, fill: '#f59e0b' }
  ] as ChartData[],
  
  upcomingEvents: [
    { event: 'Tech Conference', date: '2024-02-15', rooms: 120, impact: 'high' },
    { event: 'Wedding Season', date: '2024-03-01', rooms: 80, impact: 'medium' },
    { event: 'Holiday Weekend', date: '2024-02-18', rooms: 200, impact: 'high' }
  ]
}

// Waste Management mock data
export const wasteData = {
  kpis: [
    {
      id: '1',
      title: 'Collection Efficiency',
      value: '94.2%',
      change: 3.5,
      trend: 'up' as const,
      unit: '%'
    },
    {
      id: '2',
      title: 'Fuel Consumption',
      value: '1,247L',
      change: -8.1,
      trend: 'up' as const,
      unit: 'L'
    },
    {
      id: '3',
      title: 'Route Optimization',
      value: '87.3%',
      change: 12.4,
      trend: 'up' as const,
      unit: '%'
    },
    {
      id: '4',
      title: 'Customer Satisfaction',
      value: '4.4/5',
      change: 6.7,
      trend: 'up' as const,
      unit: '/5'
    }
  ] as DashboardKPI[],
  
  volumeTrend: generateTimeSeriesData(30, 450),
  
  wasteTypes: [
    { name: 'Residential', value: 52, change: 3.2 },
    { name: 'Commercial', value: 31, change: 8.1 },
    { name: 'Industrial', value: 12, change: -2.5 },
    { name: 'Recycling', value: 5, change: 15.3 }
  ] as ChartData[],
  
  routePerformance: [
    { name: 'Route A', value: 95, fill: '#10b981' },
    { name: 'Route B', value: 88, fill: '#3b82f6' },
    { name: 'Route C', value: 92, fill: '#8b5cf6' },
    { name: 'Route D', value: 79, fill: '#ef4444' }
  ] as ChartData[],
  
  maintenanceAlerts: [
    { vehicle: 'Truck #003', issue: 'Engine Check', priority: 'high', dueDate: '2024-02-10' },
    { vehicle: 'Truck #007', issue: 'Brake Inspection', priority: 'medium', dueDate: '2024-02-15' },
    { vehicle: 'Truck #012', issue: 'Oil Change', priority: 'low', dueDate: '2024-02-20' }
  ]
}

export const getMockDataForIndustry = (industry: Industry) => {
  switch (industry) {
    case 'retail':
      return retailData
    case 'hospitality':
      return hospitalityData
    case 'waste':
      return wasteData
    default:
      return retailData
  }
}

// Mock integrations data
export const mockIntegrations = [
  {
    id: '1',
    name: 'Shopify',
    type: 'E-commerce',
    status: 'connected' as const,
    last_sync: '2024-01-15T10:30:00Z',
    config: { store_url: 'mystore.shopify.com' }
  },
  {
    id: '2',
    name: 'Salesforce',
    type: 'CRM',
    status: 'connected' as const,
    last_sync: '2024-01-15T09:15:00Z',
    config: { instance_url: 'company.salesforce.com' }
  },
  {
    id: '3',
    name: 'Google Analytics',
    type: 'Analytics',
    status: 'disconnected' as const,
    config: { property_id: 'GA4-123456789' }
  },
  {
    id: '4',
    name: 'PostgreSQL Database',
    type: 'Database',
    status: 'error' as const,
    last_sync: '2024-01-14T18:45:00Z',
    config: { host: 'db.company.com', database: 'analytics' }
  }
]