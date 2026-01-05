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
import { useTeams, Team } from "@/context/TeamContext"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TeamsDataTable } from "@/components/teams-data-table"
import { columns } from "./columns"

export default function TeamsPage() {
  const { teams, addTeam, deleteTeam, updateTeam, setTeams } = useTeams()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [layout, setLayout] = useState<"table" | "card">("table")
  const [favoriteFilter, setFavoriteFilter] = useState<string>("all")

  // State for the new team form
  const [newName, setNewName] = useState('');
  const [newIsFavorite, setNewIsFavorite] = useState(false);

  const displayTeams = useMemo(() => {
    return teams.filter(team => {
      const favoriteMatch = favoriteFilter === "all" || (favoriteFilter === "favorites" && team.isFavorite);
      return favoriteMatch;
    });
  }, [teams, favoriteFilter])

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedTeam) {
      deleteTeam(selectedTeam.id)
      setSelectedTeam(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleCreateTeam = () => {
    if (!newName) {
      alert('Please fill in all fields.');
      return;
    }
    addTeam({ name: newName, isFavorite: newIsFavorite });
    setCreateDialogOpen(false);
    // Reset form fields
    setNewName('');
    setNewIsFavorite(false);
  };
  
  const toggleFavorite = (id: string, isFavorite: boolean) => {
    updateTeam(id, { isFavorite: !isFavorite })
  }

  const handleSetDisplayTeams = (newTeams: Team[]) => {
    const updatedTeams = newTeams.map(({ ...rest }) => rest);
    setTeams(updatedTeams)
  }

  const teamsWithActions = displayTeams.map((team) => ({
    ...team,
    handleDeleteClick: handleDeleteClick,
    toggleFavorite: toggleFavorite,
  }))

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Teams</h1>
          <p className="text-muted-foreground">
            Select a team to view its players, or create a new one to get
            started.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter teams..."
            className="w-[180px]"
            onChange={(e) => setFavoriteFilter(e.target.value)}
          />
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
                New Team
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                    A team is a collection of players.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input 
                            id="name" 
                            placeholder="e.g., The All-Stars" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
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
                    <Button onClick={handleCreateTeam}>Create</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {layout === "table" ? (
        <TeamsDataTable 
          columns={columns} 
          data={teamsWithActions} 
          setData={handleSetDisplayTeams as React.Dispatch<React.SetStateAction<Team[]>>} 
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
                    Create New Team
                </span>
                </div>
            </div>
          {displayTeams.map((team) => (
            <Card
              key={team.id}
              className="group flex flex-col border transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {team.name}
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
                        <Link href={`/teams/${team.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(team)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(team.id, team.isFavorite)}
                        className={`transition-colors ${team.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}>
                        <Star className={`h-5 w-5 ${team.isFavorite ? 'fill-current' : ''}`} />
                        <span className="sr-only">Favorite</span>
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 flex-grow flex flex-col items-center justify-center text-center">
                 <p className="text-4xl font-bold tabular-nums text-foreground">{team.players.length}</p>
                 <p className="text-xs font-medium text-muted-foreground mt-1">Players</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/teams/${team.id}/edit`}>
                        View Team
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
              <span className="font-bold">{selectedTeam?.name}</span>
              team.
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
