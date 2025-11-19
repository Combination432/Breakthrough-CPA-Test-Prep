'use client'

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { deleteQuestion } from '@/app/admin/questions/actions'
import { useRouter } from 'next/navigation'

type Question = {
  id: string
  question_type: 'MCQ' | 'TBS'
  question_number: number
  difficulty_level: string | null
  stem: string
  options: any
  correct_answer: string | null
  testlets: {
    id: string
    testlet_number: number
    testlet_type: string
    exam_sections: {
      code: string
      name: string
    } | null
  } | null
}

interface QuestionsTableProps {
  questions: Question[]
}

export function QuestionsTable({ questions }: QuestionsTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    const result = await deleteQuestion(id)
    if (result.success) {
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const columns = useMemo<ColumnDef<Question>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="font-mono text-xs">{row.original.id.substring(0, 8)}...</div>
        ),
      },
      {
        accessorKey: 'question_type',
        header: 'Type',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.question_type === 'MCQ'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {row.original.question_type}
          </span>
        ),
      },
      {
        accessorKey: 'testlets.exam_sections.code',
        header: 'Section',
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.testlets?.exam_sections?.code || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'testlets.testlet_number',
        header: 'Testlet',
        cell: ({ row }) => <span>{row.original.testlets?.testlet_number || 'N/A'}</span>,
      },
      {
        accessorKey: 'difficulty_level',
        header: 'Difficulty',
        cell: ({ row }) => {
          const difficulty = row.original.difficulty_level
          const colors = {
            easy: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            hard: 'bg-red-100 text-red-800',
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {difficulty || 'N/A'}
            </span>
          )
        },
      },
      {
        accessorKey: 'stem',
        header: 'Question Preview',
        cell: ({ row }) => (
          <div className="max-w-md truncate text-sm text-gray-600">
            {row.original.stem.substring(0, 100)}...
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/questions/${row.original.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [router]
  )

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <div className="p-4">
      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search questions..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
