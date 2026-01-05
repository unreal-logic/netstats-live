'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal, Star, ArrowUpDown, GripVertical } from "lucide-react"
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

// Extend the team type to include the functions passed from the page
interface TeamsColumn extends Team {
  handleDeleteClick: (team: Team) => void
  toggleFavorite: (id: string, isFavorite: boolean) => void
}

const DraggableHandle = ({ row }: { row: Row<TeamsColumn> }) => {
    const { attributes, listeners, setNodeRef } = useSortable({
        id: row.original.id,
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center h-full cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

export const columns: ColumnDef<TeamsColumn>[] = [
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
              team.toggleFavorite(team.id, team.isFavorite)
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
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Players
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
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
                onClick={() => team.handleDeleteClick(team)}
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