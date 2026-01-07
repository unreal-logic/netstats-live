'use client'

import { useState, useMemo, useCallback } from "react"
import { useVenues, Venue } from "@/context/VenueContext"
import { DataTable } from "@/components/data-table/data-table"
import { GridView } from "@/components/data-table/data-grid"
import { columns } from "./columns"

// UI Components
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Icons
import { PlusCircle, Star } from "lucide-react"
import { IconLayoutGrid, IconList } from "@tabler/icons-react"

export default function VenuesPage() {
  const { venues, addVenue, deleteVenue, updateVenue, setVenues } = useVenues()

  const [view, setView] = useState("list")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [currentVenue, setCurrentVenue] = useState<Partial<Venue>>({})

  const handleSetData = (updater: (prevData: Venue[]) => Venue[]) => {
    setVenues(prevVenues => {
      const newVenues = updater(prevVenues)
      return newVenues.map(({ ...rest }) => rest)
    })
  }

  const handleDeleteClick = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    setDeleteDialogOpen(true)
  }, [])

  const toggleFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      updateVenue(id, { isFavorite })
    },
    [updateVenue]
  )

  const handleConfirmDelete = useCallback(() => {
    if (selectedVenue) {
      deleteVenue(selectedVenue.id)
      setSelectedVenue(null)
    }
    setDeleteDialogOpen(false)
  }, [selectedVenue, deleteVenue])

  const handleCreateOrUpdateVenue = () => {
    if (!currentVenue.name || !currentVenue.location || !currentVenue.type) {
      alert("Please fill in all fields.")
      return
    }

    if (currentVenue.id) {
      updateVenue(currentVenue.id, currentVenue)
    } else {
      addVenue({
        id: 'venue-' + Date.now(),
        name: currentVenue.name,
        location: currentVenue.location,
        type: currentVenue.type,
        isFavorite: currentVenue.isFavorite || false,
      })
    }
    setDialogOpen(false)
    setCurrentVenue({})
  }

  const openDialog = useCallback((venue?: Venue) => {
    setCurrentVenue(venue || { type: "indoor", isFavorite: false })
    setDialogOpen(true)
  }, [])

  const displayVenues = useMemo(() => {
    return venues.filter(venue => {
      const typeMatch = typeFilter === "all" || venue.type === typeFilter
      const favoriteMatch = !showFavorites || venue.isFavorite
      const searchMatch = searchQuery
        ? venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return typeMatch && favoriteMatch && searchMatch
    })
  }, [venues, typeFilter, showFavorites, searchQuery])

  const memoizedColumns = useMemo(
    () => columns(toggleFavorite, handleDeleteClick),
    [toggleFavorite, handleDeleteClick]
  )

  const renderGridItem = (item: Venue) => (
    <div key={item.id} className="border p-4 rounded-lg">
      <h3 className="font-bold">{item.name}</h3>
      <p>{item.location}</p>
      <p className="capitalize">{item.type}</p>
    </div>
  )

  return (
    <div className="flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter venues..."
            className="w-48"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className={showFavorites ? "text-yellow-400 border-yellow-400" : ""}
          >
            <Star className={`mr-2 size-4 ${showFavorites ? "fill-current" : ""}`} />
            Favorites
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <Button variant={view === 'list' ? "secondary" : "ghost"} size="icon" onClick={() => setView('list')}>
              <IconList className="size-4" />
            </Button>
            <Button variant={view === 'grid' ? "secondary" : "ghost"} size="icon" onClick={() => setView('grid')}>
              <IconLayoutGrid className="size-4" />
            </Button>
          </div>
          <Button onClick={() => openDialog()}>
            <PlusCircle className="mr-2 size-4" />
            New Venue
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <DataTable
          columns={memoizedColumns}
          data={displayVenues} 
          setData={handleSetData as React.Dispatch<React.SetStateAction<Venue[]>>}
        />
      ) : (
        <GridView data={displayVenues} renderItem={renderGridItem} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentVenue.id ? "Edit Venue" : "Create New Venue"}</DialogTitle>
            <DialogDescription>
              Add a new location for your games and training sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name</Label>
              <Input
                id="name"
                placeholder="e.g., Central Sports Arena"
                value={currentVenue.name || ''}
                onChange={e => setCurrentVenue({ ...currentVenue, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., 123 Main St, Anytown"
                value={currentVenue.location || ''}
                onChange={e => setCurrentVenue({ ...currentVenue, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={currentVenue.type || ''}
                onValueChange={(value: 'indoor' | 'outdoor') => setCurrentVenue({ ...currentVenue, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select venue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                id="favorite-button"
                onClick={() => setCurrentVenue({ ...currentVenue, isFavorite: !currentVenue.isFavorite })}
                className={`transition-colors ${currentVenue.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                <Star className={`h-5 w-5 ${currentVenue.isFavorite ? 'fill-current' : ''}`} />
                <span className="sr-only">Toggle Favorite</span>
              </Button>
              <Label htmlFor="favorite-button" className="cursor-pointer text-base">Favorite</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrUpdateVenue}>{currentVenue.id ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-bold">{selectedVenue?.name}</span> venue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
