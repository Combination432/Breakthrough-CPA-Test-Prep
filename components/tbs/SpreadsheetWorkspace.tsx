'use client'

import { useState } from 'react'
import DataGrid, { Column } from 'react-data-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, RotateCcw } from 'lucide-react'
import type { GridColumn, GridRow } from '@/lib/mock-tbs'
import 'react-data-grid/lib/styles.css'

interface SpreadsheetWorkspaceProps {
  title: string
  columns: GridColumn[]
  initialRows: GridRow[]
  onSubmit?: (rows: GridRow[]) => void
  onReset?: () => void
}

export function SpreadsheetWorkspace({
  title,
  columns,
  initialRows,
  onSubmit,
  onReset,
}: SpreadsheetWorkspaceProps) {
  const [rows, setRows] = useState<GridRow[]>(initialRows)

  // Convert our column format to react-data-grid Column format
  const gridColumns: Column<GridRow>[] = columns.map((col) => ({
    key: col.key,
    name: col.name,
    width: col.width || 120,
    editable: col.editable,
    cellClass: (row) => {
      // Read-only cells have gray background
      if (!col.editable) {
        return 'bg-gray-100 text-gray-700'
      }
      // Editable cells with values have white background
      const value = row[col.key]
      if (value !== '' && value !== null && value !== undefined) {
        return 'bg-white'
      }
      // Empty editable cells have a light yellow hint
      return 'bg-yellow-50'
    },
    formatter: ({ row, column }: { row: GridRow; column: { key: string } }) => {
      const value = row[column.key]

      // Format numbers with commas
      if (typeof value === 'number') {
        return value.toLocaleString()
      }

      return value !== null && value !== undefined ? String(value) : ''
    },
  }))

  const handleRowsChange = (updatedRows: GridRow[]) => {
    setRows(updatedRows)
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(rows)
    }
  }

  const handleReset = () => {
    setRows(initialRows)
    if (onReset) {
      onReset()
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-auto border rounded-lg">
          <DataGrid
            columns={gridColumns}
            rows={rows}
            onRowsChange={handleRowsChange}
            className="rdg-light h-full"
            style={{ height: '100%' }}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1" size="lg">
            <Check className="mr-2 h-4 w-4" />
            Submit Answer
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border"></div>
            <span>Read-only cells (calculated)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border"></div>
            <span>Editable cells (enter your answer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border"></div>
            <span>Completed cells</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
