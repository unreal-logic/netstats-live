'use client'

import { useState, useMemo, useCallback } from "react"
import { usePlayers, Player } from "@/context/PlayerContext"
import { DataTable } from "@/components/data-table/data-table"
import { GridView } from "@/components/data-table/data-grid"
import { columns } from "./columns"

// UI Components
import { Button } from "@/components/ui/button"
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

export default function PlayersPage() {
  const { players, addPlayer, deletePlayer, updatePlayer, setPlayers } = usePlayers()

  // View, filter, and search states
  const [view, setView] = useState("list")
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // Form state for new/edit player
  const [currentPlayer, setCurrentPlayer] = useState<Partial<Player>>({})

  const handleSetData = (updater: (prevData: Player[]) => Player[]) => {
    setPlayers(prevPlayers => {
      const newPlayers = updater(prevPlayers)
      return newPlayers.map(({ ...rest }) => rest)
    })
  }

  const handleDeleteClick = useCallback((player: Player) => {
    setSelectedPlayer(player)
    setDeleteDialogOpen(true)
  }, [])

  const toggleFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      updatePlayer(id, { isFavorite })
    },
    [updatePlayer]
  )

  const handleConfirmDelete = useCallback(() => {
    if (selectedPlayer) {
      deletePlayer(selectedPlayer.id)
      setSelectedPlayer(null)
    }
    setDeleteDialogOpen(false)
  }, [selectedPlayer, deletePlayer])

  const handleCreateOrUpdatePlayer = () => {
    if (!currentPlayer.name || !currentPlayer.position) {
      alert("Please fill in all fields.")
      return
    }

    if (currentPlayer.id) {
      updatePlayer(currentPlayer.id, currentPlayer)
    } else {
      addPlayer({
        id: 'player-' + Date.now(),
        name: currentPlayer.name,
        position: currentPlayer.position,
        isFavorite: currentPlayer.isFavorite || false,
      })
    }
    setDialogOpen(false)
    setCurrentPlayer({})
  }

  const openDialog = useCallback((player?: Player) => {
    setCurrentPlayer(player || {}) 
    setDialogOpen(true)
  }, [])

  const displayPlayers = useMemo(() => {
    return players.filter(player => {
      const favoriteMatch = !showFavorites || player.isFavorite
      const searchMatch = searchQuery
        ? player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.position.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return favoriteMatch && searchMatch
    })
  }, [players, showFavorites, searchQuery])

  const memoizedColumns = useMemo(
    () => columns(toggleFavorite, openDialog, handleDeleteClick),
    [toggleFavorite, openDialog, handleDeleteClick]
  )

  const renderGridItem = (item: Player) => (
    <div key={item.id} className="border p-4 rounded-lg">
      <h3 className="font-bold">{item.name}</h3>
      <p>{item.position}</p>
    </div>
  )

  return (
    <div className="flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter players..."
            className="w-48"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
            New Player
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <DataTable
          columns={memoizedColumns}
          data={displayPlayers}
          setData={handleSetData as React.Dispatch<React.SetStateAction<Player[]>>}
        />
      ) : (
        <GridView data={displayPlayers} renderItem={renderGridItem} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentPlayer.id ? "Edit Player" : "Create New Player"}</DialogTitle>
            <DialogDescription>
              Add a new player to your roster.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                placeholder="e.g., Jane Doe"
                value={currentPlayer.name || ''}
                onChange={e => setCurrentPlayer({ ...currentPlayer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g., Center"
                value={currentPlayer.position || ''}
                onChange={e => setCurrentPlayer({ ...currentPlayer, position: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                id="favorite-button"
                onClick={() => setCurrentPlayer({ ...currentPlayer, isFavorite: !currentPlayer.isFavorite })}
                className={`transition-colors ${currentPlayer.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                <Star className={`h-5 w-5 ${currentPlayer.isFavorite ? 'fill-current' : ''}`} />
                <span className="sr-only">Toggle Favorite</span>
              </Button>
              <Label htmlFor="favorite-button" className="cursor-pointer text-base">Favorite</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrUpdatePlayer}>{currentPlayer.id ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-bold">{selectedPlayer?.name}</span> player.
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
