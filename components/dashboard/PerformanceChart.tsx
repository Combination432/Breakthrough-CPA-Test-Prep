'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PerformanceChartProps {
  data: {
    section: string
    score: number
    attempts: number
  }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const getBarColor = (score: number) => {
    if (score >= 75) return '#10b981' // Green - passing
    if (score >= 50) return '#f59e0b' // Yellow - needs improvement
    return '#ef4444' // Red - needs work
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="section"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: '#d1d5db' }}
          label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px 12px',
          }}
          labelStyle={{ color: '#111827', fontWeight: 600 }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'score') {
              return [
                `${value}% (${props.payload.attempts} attempt${props.payload.attempts !== 1 ? 's' : ''})`,
                'Average Score',
              ]
            }
            return [value, name]
          }}
        />
        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
