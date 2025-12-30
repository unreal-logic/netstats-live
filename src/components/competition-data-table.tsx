'use client'

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Cell,
} from "@tanstack/react-table"

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow
} from "@/components/ui/table"

interface DraggableRowProps<TData> {
  row: Row<TData>;
}

function DraggableRow<TData extends { id: UniqueIdentifier }>({
  row,
}: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-50" : ""}
    >
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

interface CompetitionDataTableProps<TData extends { id: UniqueIdentifier }> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  setData: React.Dispatch<React.SetStateAction<TData[]>>
}

export function CompetitionDataTable<TData extends { id: UniqueIdentifier }>({ 
    columns, 
    data, 
    setData 
}: CompetitionDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
  })

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map(({ id }) => id), [data])

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = currentData.findIndex(item => item.id === active.id)
        const newIndex = currentData.findIndex(item => item.id === over.id)
        return arrayMove(currentData, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
    </DndContext>
  )
}
