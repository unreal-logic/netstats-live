'use client'

import * as React from "react"
import {
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const [view, setView] = React.useState("list")

    const types = [{
        value: "Type 1",
        label: "Type 1",
    },
    {
        value: "Type 2",
        label: "Type 2",
    }]

    const statuses = [
        {
            value: "Status 1",
            label: "Status 1",
        },
        {
            value: "Status 2",
            label: "Status 2",
        },
    ]

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={types}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          defaultValue={view}
          onValueChange={(value) => setView(value)}
          className="hidden md:flex"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <IconLayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <IconLayoutList />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button>
          <IconPlus size={16} className="mr-2" />
          New Competition
        </Button>
      </div>
    </div>
  )
}