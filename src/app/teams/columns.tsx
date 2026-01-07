'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal, Star, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Team } from "@/context/TeamContext"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// A draggable row handle component
const DraggableHandle = ({ row }: { row: Row<Team> }) => {
    const { attributes, listeners, setNodeRef } = useSortable({
        id: row.original.id,
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center h-full cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

// This is now a function that accepts the handlers and returns the column definitions
export const columns = (
  toggleFavorite: (id: string, isFavorite: boolean) => void,
  handleDeleteClick: (team: Team) => void
): ColumnDef<Team>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" />
      )
    },
    cell: ({ row }) => {
      const team = row.original
      return (
        <Link
          href={`/teams/${team.id}/edit`}
          className='font-medium text-primary hover:underline'
        >
          {team.name}
        </Link>
      )
    },
    size: 120,
  },
  {
    accessorKey: "isFavorite",
    header: () => <div className='text-center'>Favorite</div>,
    cell: ({ row }) => {
      const team = row.original
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              toggleFavorite(team.id, !team.isFavorite) // Use the passed-in handler
            }
            className={`transition-colors ${
              team.isFavorite
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star className={`h-5 w-5 ${team.isFavorite ? 'fill-current' : ''}`} />
            <span className='sr-only'>Toggle Favorite</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "players",
    header: ({ column }) => {
        return (
          <div className="text-center">
            <DataTableColumnHeader column={column} title="Players" />
          </div>
        )
    },
    cell: ({ row }) => {
      return <div className="text-center tabular-nums">{row.original.players.length}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original

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
                <Link href={`/teams/${team.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(team)} // Use the passed-in handler
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