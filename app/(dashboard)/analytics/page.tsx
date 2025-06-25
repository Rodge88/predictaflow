'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Target,
  Brain,
  Clock,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { retailData } from '@/lib/mock-data'

// Advanced analytics data
const predictionAccuracy = [
  { period: 'Week 1', accuracy: 87.2, confidence: 0.92 },
  { period: 'Week 2', accuracy: 89.1, confidence: 0.89 },
  { period: 'Week 3', accuracy: 91.5, confidence: 0.94 },
  { period: 'Week 4', accuracy: 88.7, confidence: 0.91 },
]

interface ForecastDataPoint {
  timestamp: string;
  actual?: number | null;
  predicted: number;
  confidence: number;
}

const historicalData = retailData.salesTrend.slice(-7).map(item => ({
  timestamp: item.timestamp,
  actual: item.actual,
  predicted: item.predicted,
  confidence: item.confidence
}));

const futureData: ForecastDataPoint[] = [
  { timestamp: '2024-02-16', actual: null, predicted: 26800, confidence: 0.87 },
  { timestamp: '2024-02-17', actual: null, predicted: 27200, confidence: 0.84 },
  { timestamp: '2024-02-18', actual: null, predicted: 26950, confidence: 0.86 },
  { timestamp: '2024-02-19', actual: null, predicted: 28100, confidence: 0.82 },
  { timestamp: '2024-02-20', actual: null, predicted: 27800, confidence: 0.85 },
  { timestamp: '2024-02-21', actual: null, predicted: 29200, confidence: 0.81 },
  { timestamp: '2024-02-22', actual: null, predicted: 30500, confidence: 0.79 },
];

const forecastData: ForecastDataPoint[] = [...historicalData, ...futureData];

const anomalyData = [
  { date: '2024-01-15', value: 32000, anomaly: true, severity: 'high' },
  { date: '2024-01-18', value: 18000, anomaly: true, severity: 'medium' },
  { date: '2024-01-22', value: 35000, anomaly: true, severity: 'low' },
  { date: '2024-01-28', value: 15000, anomaly: true, severity: 'high' },
]

const modelMetrics = [
  { name: 'Sales Forecast', accuracy: 91.2, lastTrained: '2024-01-15', status: 'active' },
  { name: 'Inventory Prediction', accuracy: 87.8, lastTrained: '2024-01-14', status: 'active' },
  { name: 'Customer Behavior', accuracy: 84.5, lastTrained: '2024-01-13', status: 'training' },
  { name: 'Price Optimization', accuracy: 89.1, lastTrained: '2024-01-12', status: 'active' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedModel, setSelectedModel] = useState('sales')

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
            Advanced Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deep dive into your predictive models and forecasting accuracy
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2.1%</span> from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+156</span> this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+1</span> since yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47ms</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-12ms</span> improvement
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecasting Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>7-Day Sales Forecast</CardTitle>
              <CardDescription>
                Historical data with confidence intervals and future predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [
                      value !== null && value !== undefined ? Number(value).toLocaleString() : 'N/A',
                      name === 'actual' ? 'Actual' : 'Predicted'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Accuracy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy Trend</CardTitle>
              <CardDescription>
                Weekly accuracy and confidence metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={predictionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[80, 100]} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Accuracy']} />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Model Performance & Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>
                Current status and accuracy of all ML models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelMetrics.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge 
                          variant={model.status === 'active' ? 'default' : 'secondary'}
                        >
                          {model.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last trained: {new Date(model.lastTrained).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{model.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Anomaly Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Anomalies</CardTitle>
              <CardDescription>
                Unusual patterns detected in your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalyData.map((anomaly, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        anomaly.severity === 'high' ? 'bg-red-500' :
                        anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          {new Date(anomaly.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Value: ${anomaly.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        anomaly.severity === 'high' ? 'destructive' : 'secondary'
                      }
                    >
                      {anomaly.severity} severity
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Feature Importance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>
              Most influential factors in prediction accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { feature: 'Historical Sales', importance: 0.34 },
                  { feature: 'Seasonality', importance: 0.28 },
                  { feature: 'Marketing Spend', importance: 0.19 },
                  { feature: 'Product Category', importance: 0.12 },
                  { feature: 'Customer Segments', importance: 0.07 },
                ]}
                layout="horizontal"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 0.4]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} width={90} />
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']} />
                <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}