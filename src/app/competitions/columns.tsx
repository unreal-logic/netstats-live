'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal, Star, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Competition } from "@/context/CompetitionContext"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// Extend the competition type to include the functions passed from the page
interface CompetitionsColumn extends Competition {
  handleDeleteClick: (competition: Competition) => void
  toggleFavorite: (id: string, isFavorite: boolean) => void
}

const DraggableHandle = ({ row }: { row: Row<CompetitionsColumn> }) => {
    const { attributes, listeners, setNodeRef } = useSortable({
        id: row.original.id,
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center h-full cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

export const columns: ColumnDef<CompetitionsColumn>[] = [
  {
    id: "drag-handle",
    header: () => null,
    cell: ({ row }) => <DraggableHandle row={row} />,
    size: 10,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    id: "favorite",
    header: () => null,
    cell: ({ row }) => {
      const competition = row.original
      return (
        <div className='grid place-content-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              competition.toggleFavorite(competition.id, !competition.isFavorite)
            }
            className={`size-8 transition-colors ${
              competition.isFavorite
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-muted-foreground/50 hover:text-yellow-400"
            }`}
          >
            <Star
              className={`size-4 ${
                competition.isFavorite ? "fill-current" : ""
              }`}
            />
            <span className='sr-only'>Toggle Favorite</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" />
      )
    },
    cell: ({ row }) => {
      const competition = row.original
      return (
        <Link
          href={`/competitions/${competition.id}/games`}
          className='font-medium text-primary hover:underline'
        >
          {competition.name}
        </Link>
      )
    },
    size: 120,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Type" align="center" />
      )
    },
    cell: ({ row }) => {
      const competition = row.original
      return (
        <div className="text-center">
            <Badge
              variant={competition.type === "League" ? "default" : "secondary"}
              className="capitalize"
            >
              {competition.type}
            </Badge>
        </div>
      )
    },
  },
    {
        accessorKey: "format",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Format" align="center" />
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.format}</div>
        },
    },
  {
    accessorKey: "games",
    header: ({ column }) => {
        return (
            <DataTableColumnHeader column={column} title="Games" align="center" />
        )
    },
    cell: ({ row }) => {
      return <div className="text-center tabular-nums">{row.original.games.length}</div>
    },
  },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Start Date" align="center" />
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.startDate}</div>
        },
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="End Date" align="center" />
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.endDate}</div>
        },
    },
  {
    id: "actions",
    cell: ({ row }) => {
      const competition = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/competitions/${competition.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => competition.handleDeleteClick(competition)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
