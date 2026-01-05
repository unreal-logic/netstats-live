'use client'

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  MoreHorizontal,
  PlusCircle,
  Star,
  Grid,
  List,
  ArrowRight,
  MapPin,
} from "lucide-react"
import { useVenues, Venue } from "@/context/VenueContext"

import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VenuesDataTable } from "@/components/venues-data-table"
import { columns } from "./columns"

export default function VenuesPage() {
  const { venues, addVenue, deleteVenue, updateVenue, setVenues } = useVenues()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [layout, setLayout] = useState<"table" | "card">("table")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [favoriteFilter, setFavoriteFilter] = useState<string>("all")

  // State for the new venue form
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'indoor' | 'outdoor'>('indoor');
  const [newIsFavorite, setNewIsFavorite] = useState(false);

  const displayVenues = useMemo(() => {
    return venues.filter(venue => {
      const typeMatch = typeFilter === "all" || venue.type === typeFilter;
      const favoriteMatch = favoriteFilter === "all" || (favoriteFilter === "favorites" && venue.isFavorite);
      return typeMatch && favoriteMatch;
    });
  }, [venues, typeFilter, favoriteFilter])

  const handleDeleteClick = (venue: Venue) => {
    setSelectedVenue(venue)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedVenue) {
      deleteVenue(selectedVenue.id)
      setSelectedVenue(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleCreateVenue = () => {
    if (!newName || !newLocation) {
      alert('Please fill in all fields.');
      return;
    }
    addVenue({ name: newName, location: newLocation, type: newType, isFavorite: newIsFavorite });
    setCreateDialogOpen(false);
    // Reset form fields
    setNewName('');
    setNewLocation('');
    setNewType('indoor');
    setNewIsFavorite(false);
  };
  
  const toggleFavorite = (id: string, isFavorite: boolean) => {
    updateVenue(id, { isFavorite: !isFavorite })
  }

  const handleSetDisplayVenues = (newVenues: Venue[]) => {
    const updatedVenues = newVenues.map(({ ...rest }) => rest);
    setVenues(updatedVenues)
  }

  const venuesWithActions = displayVenues.map((venue) => ({
    ...venue,
    handleDeleteClick: handleDeleteClick,
    toggleFavorite: toggleFavorite,
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Venues</h1>
          <p className="text-muted-foreground">
            Manage your game and training locations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by favorite" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={layout === 'card' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setLayout("card")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Card View</span>
          </Button>
          <Button
            variant={layout === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setLayout("table")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Table View</span>
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button className="ml-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Venue
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Create New Venue</DialogTitle>
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
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Location</Label>
                        <Input 
                            id="location" 
                            placeholder="e.g., 123 Main St, Anytown"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value: 'indoor' | 'outdoor') => setNewType(value)} defaultValue={newType}>
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
                            onClick={() => setNewIsFavorite(!newIsFavorite)}
                            className={`transition-colors ${newIsFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                            <Star className={`h-5 w-5 ${newIsFavorite ? 'fill-current' : ''}`} />
                            <span className="sr-only">Toggle Favorite</span>
                        </Button>
                        <Label htmlFor="favorite-button" className="cursor-pointer text-base">
                        Favorite
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateVenue}>Create</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {layout === "table" ? (
        <VenuesDataTable 
          columns={columns} 
          data={venuesWithActions} 
          setData={handleSetDisplayVenues as React.Dispatch<React.SetStateAction<Venue[]>>} 
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div 
                onClick={() => setCreateDialogOpen(true)}
                className="group flex flex-col items-center justify-center h-full p-4 border-2 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer bg-card text-card-foreground shadow-sm"
            >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-5 w-5 transition-colors group-hover:text-primary" />
                <span className="font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                    Create New Venue
                </span>
                </div>
            </div>
          {displayVenues.map((venue) => (
            <Card
              key={venue.id}
              className="group flex flex-col border transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {venue.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/venues/${venue.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(venue)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                 <div className="flex items-center justify-between pt-2">
                    <Badge
                        variant={venue.type === 'indoor' ? 'default' : 'secondary'}
                        className="capitalize"
                    >
                        {venue.type}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(venue.id, venue.isFavorite)}
                        className={`transition-colors ${venue.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                        <Star className={`h-5 w-5 ${venue.isFavorite ? 'fill-current' : ''}`} />
                        <span className="sr-only">Favorite</span>
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 flex-grow flex flex-col items-start justify-center">
                 <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> {venue.location}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/venues/${venue.id}/games`}>
                        View Games
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-bold">{selectedVenue?.name}</span>
              venue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
