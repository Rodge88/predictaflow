'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { retailData, hospitalityData, wasteData } from '@/lib/mock-data'
import type { Industry } from '@/types'

// Mock industry detection (in real app, this would come from user preferences)
const getCurrentIndustry = (): Industry => 'retail'

const industryData = {
  retail: retailData,
  hospitality: hospitalityData,
  waste: wasteData
}

const industryConfig = {
  retail: {
    name: 'Retail Analytics',
    primaryColor: '#3b82f6',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500'
  },
  hospitality: {
    name: 'Hospitality Intelligence',
    primaryColor: '#8b5cf6',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500'
  },
  waste: {
    name: 'Waste Management',
    primaryColor: '#10b981',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  }
}

export default function DashboardPage() {
  const [industry] = useState<Industry>(getCurrentIndustry())
  const [timeRange, setTimeRange] = useState('30d')
  const data = industryData[industry]
  const config = industryConfig[industry]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {config.name} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights and predictive analytics for your business
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {data.kpis.map((kpi, index) => (
          <motion.div key={kpi.id} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Trend Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>
                {industry === 'retail' && 'Sales Trend & Predictions'}
                {industry === 'hospitality' && 'Occupancy Trend & Predictions'}
                {industry === 'waste' && 'Volume Trend & Predictions'}
              </CardTitle>
              <CardDescription>
                Actual vs predicted values with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={
                  industry === 'retail' ? (data as any).salesTrend :
                  industry === 'hospitality' ? (data as any).occupancyTrend :
                  (data as any).volumeTrend
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      typeof value === 'number' ? value.toLocaleString() : value,
                      name === 'actual' ? 'Actual' : 'Predicted'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke={config.primaryColor}
                    strokeWidth={2}
                    dot={false}
                    name="actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>
                {industry === 'retail' && 'Top Products'}
                {industry === 'hospitality' && 'Room Types Performance'}
                {industry === 'waste' && 'Waste Types Distribution'}
              </CardTitle>
              <CardDescription>
                Performance breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={
                  industry === 'retail' ? (data as any).topProducts :
                  industry === 'hospitality' ? (data as any).roomTypes :
                  (data as any).wasteTypes
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill={config.primaryColor}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>
                {industry === 'retail' && 'Category Breakdown'}
                {industry === 'hospitality' && 'Revenue Channels'}
                {industry === 'waste' && 'Route Performance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={
                      industry === 'retail' ? (data as any).categoryBreakdown :
                      industry === 'hospitality' ? (data as any).revenueChannels :
                      (data as any).routePerformance
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(industry === 'retail' ? (data as any).categoryBreakdown :
                      industry === 'hospitality' ? (data as any).revenueChannels :
                      (data as any).routePerformance
                    ).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts/Events */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {industry === 'retail' && 'Inventory Alerts'}
                {industry === 'hospitality' && 'Upcoming Events'}
                {industry === 'waste' && 'Maintenance Alerts'}
              </CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industry === 'retail' && (data as any).inventoryAlerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        alert.urgency === 'high' ? 'bg-red-500' :
                        alert.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.product}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {alert.currentStock} | Reorder: {alert.reorderPoint}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {alert.urgency}
                    </Badge>
                  </div>
                ))}

                {industry === 'hospitality' && (data as any).upcomingEvents.map((event: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.rooms} rooms
                        </p>
                      </div>
                    </div>
                    <Badge variant={event.impact === 'high' ? 'default' : 'secondary'}>
                      {event.impact} impact
                    </Badge>
                  </div>
                ))}

                {industry === 'waste' && (data as any).maintenanceAlerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        alert.priority === 'high' ? 'bg-red-500' :
                        alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.vehicle}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.issue} • Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}