'use client'

import { useState, useMemo, useCallback, useEffect } from "react"
import { useCompetitions, Competition } from "@/context/CompetitionContext"
import { DataTable } from "@/components/data-table/data-table"
import { GridView } from "@/components/data-table/data-grid"
import { columns } from "./columns"
import testData from "./data.json"

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

export default function CompetitionsPage() {
  const {
    competitions,
    addCompetition,
    deleteCompetition,
    updateCompetition,
    setCompetitions,
  } = useCompetitions()

  // Initialize data on client mount
  useEffect(() => {
    // Only set initial data if competitions array is empty
    if (competitions.length === 0) {
      setCompetitions(testData as Competition[])
    }
  }, [setCompetitions, competitions.length])

  // View and filter states
  const [view, setView] = useState("list")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showFavorites, setShowFavorites] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)

  // Form states for new/edit
  const [currentCompetition, setCurrentCompetition] = useState<Partial<Competition>>({})

  // Handlers
  const handleSetData = (
    updater: (prevData: Competition[]) => Competition[]
  ) => {
    setCompetitions(prevCompetitions => {
      const newCompetitions = updater(prevCompetitions)
      return newCompetitions.map(({ ...rest }) => rest)
    })
  }

  const handleDeleteClick = useCallback((competition: Competition) => {
    setSelectedCompetition(competition)
    setDeleteDialogOpen(true)
  }, [])

  const toggleFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      updateCompetition(id, { isFavorite: !isFavorite })
    },
    [updateCompetition]
  )

  const handleConfirmDelete = useCallback(() => {
    if (selectedCompetition) {
      deleteCompetition(selectedCompetition.id)
      setSelectedCompetition(null)
    }
    setDeleteDialogOpen(false)
  }, [selectedCompetition, deleteCompetition])

  const handleCreateOrUpdateCompetition = () => {
    if (!currentCompetition.name || !currentCompetition.type) {
      alert("Please fill in all fields.")
      return
    }

    if (currentCompetition.id) {
      // Update existing competition
      updateCompetition(currentCompetition.id, currentCompetition)
    } else {
      // Create new competition
      addCompetition({
        id: 'comp-' + Date.now(), // Assign a unique ID
        name: currentCompetition.name,
        type: currentCompetition.type,
        isFavorite: currentCompetition.isFavorite || false,
        format: '7-a-side', // Default or from form
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        games: [],
        ...currentCompetition,
      })
    }
    setCreateDialogOpen(false)
    setCurrentCompetition({})
  }
  
  const openCreateDialog = () => {
    setCurrentCompetition({});
    setCreateDialogOpen(true);
  };

  // Memoized data for display
  const displayCompetitions = useMemo(() => {
    return competitions
      .filter(comp => {
        const typeMatch = typeFilter === "all" || comp.type === typeFilter
        const favoriteMatch = !showFavorites || comp.isFavorite
        return typeMatch && favoriteMatch
      })
      .map(comp => ({
        ...comp,
        handleDeleteClick: handleDeleteClick,
        toggleFavorite: toggleFavorite,
      }))
  }, [competitions, typeFilter, showFavorites, handleDeleteClick, toggleFavorite])

  const renderGridItem = (item: Competition) => (
    <div key={item.id} className="border p-4 rounded-lg">
      <h3 className="font-bold">{item.name}</h3>
      <p>{item.type}</p>
      {/* Add more details or actions as needed */}
    </div>
  )

  return (
    <div className="flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="League">Leagues</SelectItem>
              <SelectItem value="Tournament">Tournaments</SelectItem>
              <SelectItem value="Friendly">Friendlies</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className={
              showFavorites ? "text-yellow-400 border-yellow-400" : ""
            }
          >
            <Star
              className={`mr-2 size-4 ${showFavorites ? "fill-current" : ""}`}
            />
            Favorites
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <IconList className="size-4" />
              <span className="sr-only">List View</span>
            </Button>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <IconLayoutGrid className="size-4" />
              <span className="sr-only">Grid View</span>
            </Button>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 size-4" />
            New Competition
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <DataTable
          columns={columns}
          data={displayCompetitions}
          setData={
            handleSetData as React.Dispatch<React.SetStateAction<Competition[]>>
          }
        />
      ) : (
        <GridView data={displayCompetitions} renderItem={renderGridItem} />
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentCompetition.id ? "Edit Competition" : "Create New Competition"}
            </DialogTitle>
            <DialogDescription>
              A competition is a collection of games, like a season or a
              tournament.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Competition Name</Label>
              <Input
                id="name"
                placeholder="e.g., Winter League 2024"
                value={currentCompetition.name || ""}
                onChange={e =>
                  setCurrentCompetition({
                    ...currentCompetition,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={currentCompetition.type || undefined}
                onValueChange={(
                  value: "League" | "Tournament" | "Friendly"
                ) =>
                  setCurrentCompetition({ ...currentCompetition, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select competition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="League">League</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                id="favorite-button"
                onClick={() =>
                  setCurrentCompetition({
                    ...currentCompetition,
                    isFavorite: !currentCompetition.isFavorite,
                  })
                }
                className={`transition-colors ${
                  currentCompetition.isFavorite
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-muted-foreground hover:text-yellow-400"
                }`}
              >
                <Star
                  className={`h-5 w-5 ${
                    currentCompetition.isFavorite ? "fill-current" : ""
                  }`}
                />
                <span className="sr-only">Toggle Favorite</span>
              </Button>
              <Label
                htmlFor="favorite-button"
                className="cursor-pointer text-base"
              >
                Favorite
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdateCompetition}>
              {currentCompetition.id ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-bold">{selectedCompetition?.name}</span>{" "}
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
    </div>
  )
}
