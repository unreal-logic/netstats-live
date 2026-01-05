'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal, Star, ArrowUpDown, GripVertical, MapPin } from "lucide-react"
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
import { Venue } from "@/context/VenueContext"

// Extend the venue type to include the functions passed from the page
interface VenuesColumn extends Venue {
  handleDeleteClick: (venue: Venue) => void
  toggleFavorite: (id: string, isFavorite: boolean) => void
}

const DraggableHandle = ({ row }: { row: Row<VenuesColumn> }) => {
    const { attributes, listeners, setNodeRef } = useSortable({
        id: row.original.id,
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className="flex items-center h-full cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

export const columns: ColumnDef<VenuesColumn>[] = [
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
      const venue = row.original
      return (
        <Link
          href={`/venues/${venue.id}/games`}
          className='font-medium text-primary hover:underline'
        >
          {venue.name}
        </Link>
      )
    },
    size: 120,
  },
  {
    accessorKey: "isFavorite",
    header: () => <div className='text-center'>Favorite</div>,
    cell: ({ row }) => {
      const venue = row.original
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              venue.toggleFavorite(venue.id, venue.isFavorite)
            }
            className={`transition-colors ${
              venue.isFavorite
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star className={`h-5 w-5 ${venue.isFavorite ? 'fill-current' : ''}`} />
            <span className='sr-only'>Toggle Favorite</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
   {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const venue = row.original
      return (
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {venue.location}</div>
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
      const venue = row.original
      return (
        <div className="text-center">
            <Badge
              variant={venue.type === "indoor" ? "default" : "secondary"}
              className="capitalize"
            >
              {venue.type}
            </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const venue = row.original

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
                <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => venue.handleDeleteClick(venue)}
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
