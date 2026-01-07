'use client'

import { useState, useMemo } from "react"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "@/components/data-table/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"

import initialData from "./data.json"
import { columns } from "./columns"

export default function Page() {
  const [data, setData] = useState(() =>
    initialData.map((item, index) => ({ ...item, isFavorite: index < 3 }))
  )

  const toggleFavorite = (id: number) => {
    setData((currentData) =>
      currentData.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    )
  }

  const dataWithActions = useMemo(() => {
    return data.map((item) => ({
      ...item,
      toggleFavorite: toggleFavorite,
    }))
  }, [data])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable columns={columns} data={dataWithActions} />
        </div>
      </div>
    </div>
  )
}
