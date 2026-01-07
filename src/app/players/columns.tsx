'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal, Star, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Player } from "@/context/PlayerContext"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// A draggable row handle component
const DraggableHandle = ({ row }: { row: Row<Player> }) => {
    const { attributes, listeners, setNodeRef } = useSortable({
        id: row.original.id,
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center h-full cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

// This is now a function that returns the columns array
export const columns = (
  toggleFavorite: (id: string, isFavorite: boolean) => void,
  handleEditClick: (player: Player) => void,
  handleDeleteClick: (player: Player) => void
): ColumnDef<Player>[] => [
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
    accessorKey: "isFavorite",
    header: () => <div className='text-center'>Favorite</div>,
    cell: ({ row }) => {
      const player = row.original
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              toggleFavorite(player.id, !player.isFavorite)
            }
            className={`transition-colors ${
              player.isFavorite
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star className={`h-5 w-5 ${player.isFavorite ? 'fill-current' : ''}`} />
            <span className='sr-only'>Toggle Favorite</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" />
      )
    },
    cell: ({ row }) => {
      const player = row.original;
      return (
          <div className="font-medium">
              {player.name}
          </div>
      );
  }
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditClick(player)}>
                Edit Player
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(player.id)}
              >
                Copy player ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteClick(player)}>
                Delete player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
