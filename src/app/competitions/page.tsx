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
} from "lucide-react"
import { useCompetitions, Competition } from "@/context/CompetitionContext"

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
import { CompetitionDataTable } from "@/components/competition-data-table"
import { columns } from "./columns"

export default function CompetitionsPage() {
  const { competitions, addCompetition, deleteCompetition, updateCompetition, setCompetitions } = useCompetitions()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [layout, setLayout] = useState<"table" | "card">("table")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [favoriteFilter, setFavoriteFilter] = useState<string>("all")

  // State for the new competition form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'season' | 'tournament'>('season');
  const [newIsFavorite, setNewIsFavorite] = useState(false);

  const displayCompetitions = useMemo(() => {
    return competitions.filter(comp => {
      const typeMatch = typeFilter === "all" || comp.type === typeFilter;
      const favoriteMatch = favoriteFilter === "all" || (favoriteFilter === "favorites" && comp.isFavorite);
      return typeMatch && favoriteMatch;
    });
  }, [competitions, typeFilter, favoriteFilter])

  const handleDeleteClick = (competition: Competition) => {
    setSelectedCompetition(competition)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCompetition) {
      deleteCompetition(selectedCompetition.id)
      setSelectedCompetition(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleCreateCompetition = () => {
    if (!newName || !newType) {
      alert('Please fill in all fields.');
      return;
    }
    addCompetition({ name: newName, type: newType, isFavorite: newIsFavorite });
    setCreateDialogOpen(false);
    // Reset form fields
    setNewName('');
    setNewType('season');
    setNewIsFavorite(false);
  };
  
  const toggleFavorite = (id: string, isFavorite: boolean) => {
    updateCompetition(id, { isFavorite: !isFavorite })
  }

  const handleSetDisplayCompetitions = (newCompetitions: Competition[]) => {
    const updatedCompetitions = newCompetitions.map(({ ...rest }) => rest);
    setCompetitions(updatedCompetitions)
  }

  const competitionsWithActions = displayCompetitions.map((comp) => ({
    ...comp,
    handleDeleteClick: handleDeleteClick,
    toggleFavorite: toggleFavorite,
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Seasons & Tournaments</h1>
          <p className="text-muted-foreground">
            Select a competition to view its games, or create a new one to get
            started.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="season">Seasons</SelectItem>
              <SelectItem value="tournament">Tournaments</SelectItem>
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
                New Competition
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Create New Competition</DialogTitle>
                <DialogDescription>
                    A competition is a collection of games, like a season or a tournament.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Competition Name</Label>
                        <Input 
                            id="name" 
                            placeholder="e.g., Winter League 2024" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value: 'season' | 'tournament') => setNewType(value)} defaultValue={newType}>
                            <SelectTrigger id="type">
                            <SelectValue placeholder="Select competition type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="season">Season</SelectItem>
                            <SelectItem value="tournament">Tournament</SelectItem>
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
                        Mark as favorite
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateCompetition}>Create</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {layout === "table" ? (
        <CompetitionDataTable 
          columns={columns} 
          data={competitionsWithActions} 
          setData={handleSetDisplayCompetitions as React.Dispatch<React.SetStateAction<Competition[]>>} 
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
                    Create New Competition
                </span>
                </div>
            </div>
          {displayCompetitions.map((comp) => (
            <Card
              key={comp.id}
              className="group flex flex-col border transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {comp.name}
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
                        <Link href={`/competitions/${comp.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(comp)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between pt-2">
                <Badge
                    variant={comp.type === 'season' ? 'season' : 'tournament'}
                    className="capitalize"
                >
                    {comp.type}
                </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(comp.id, comp.isFavorite)}
                        className={`transition-colors ${comp.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                        <Star className={`h-5 w-5 ${comp.isFavorite ? 'fill-current' : ''}`} />
                        <span className="sr-only">Favorite</span>
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 flex-grow flex flex-col items-center justify-center text-center">
                 <p className="text-4xl font-bold tabular-nums text-foreground">{comp.games.length}</p>
                 <p className="text-xs font-medium text-muted-foreground mt-1">Games</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/competitions/${comp.id}/games`}>
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
              <span className="font-bold">{selectedCompetition?.name}</span>
              competition.
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
