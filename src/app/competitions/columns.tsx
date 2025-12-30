'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal, Star, ArrowUpDown, GripVertical } from "lucide-react"
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
import { Competition } from "@/context/CompetitionContext"

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
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center justify-center cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

export const columns: ColumnDef<CompetitionsColumn>[] = [
  {
    id: "drag-handle",
    header: () => null,
    cell: ({ row }) => <DraggableHandle row={row} />,
    size: 32,
  },
  {
    accessorKey: "isFavorite",
    header: () => <div className='text-center'>Favorite</div>,
    cell: ({ row }) => {
      const competition = row.original
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              competition.toggleFavorite(competition.id, competition.isFavorite)
            }
            className={`transition-colors ${
              competition.isFavorite
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star className={`h-5 w-5 ${competition.isFavorite ? 'fill-current' : ''}`} />
            <span className='sr-only'>Toggle Favorite</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
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
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const competition = row.original
      return (
        <div className="text-center">
            <Badge
              variant={competition.type === "season" ? "season" : "tournament"}
              className="capitalize"
            >
              {competition.type}
            </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "games",
    header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Games
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
    },
    cell: ({ row }) => {
      return <div className="text-center tabular-nums">{row.original.games.length}</div>
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
