'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import type { Exhibit } from '@/lib/mock-tbs'

interface ExhibitViewerProps {
  exhibits: Exhibit[]
}

export function ExhibitViewer({ exhibits }: ExhibitViewerProps) {
  if (!exhibits || exhibits.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No exhibits available
      </div>
    )
  }

  return (
    <Tabs defaultValue={exhibits[0].id} className="h-full flex flex-col">
      <TabsList className="w-full justify-start">
        {exhibits.map((exhibit) => (
          <TabsTrigger
            key={exhibit.id}
            value={exhibit.id}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {exhibit.title}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="flex-1 overflow-auto mt-4">
        {exhibits.map((exhibit) => (
          <TabsContent
            key={exhibit.id}
            value={exhibit.id}
            className="h-full m-0"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {exhibit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exhibit.type === 'text' && (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {exhibit.content as string}
                  </div>
                )}
                {exhibit.type === 'table' && typeof exhibit.content === 'object' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      {exhibit.content.headers && (
                        <thead>
                          <tr className="bg-gray-100">
                            {exhibit.content.headers.map((header, idx) => (
                              <th
                                key={idx}
                                className="border border-gray-300 px-4 py-2 text-left font-semibold"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      {exhibit.content.rows && (
                        <tbody>
                          {exhibit.content.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50">
                              {row.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className="border border-gray-300 px-4 py-2"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                )}
                {exhibit.type === 'pdf' && (
                  <div className="text-center text-gray-500 py-8">
                    PDF viewer will be implemented here
                    <br />
                    <span className="text-sm">URL: {exhibit.content as string}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
