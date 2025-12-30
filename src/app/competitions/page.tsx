'use client'

import Link from "next/link"
import {
  MoreHorizontal,
  PlusCircle,
  Star,
  Grid,
  List,
  Folder,
  ArrowRight,
} from "lucide-react"
import { useCompetitions } from "@/context/CompetitionContext"
import { useState } from "react"

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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Competition } from "@/context/CompetitionContext"

export default function CompetitionsPage() {
  const { competitions, deleteCompetition } = useCompetitions()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null)
  const [layout, setLayout] = useState<"card" | "table">("card")

  const handleDeleteClick = (competition: Competition) => {
    setSelectedCompetition(competition)
    setDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCompetition) {
      deleteCompetition(selectedCompetition.id)
      setSelectedCompetition(null)
    }
    setDialogOpen(false)
  }

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
          <Button
            variant={layout === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setLayout("card")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Card View</span>
          </Button>
          <Button
            variant={layout === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setLayout("table")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Table View</span>
          </Button>
        </div>
      </div>

      {layout === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link
            href="/competitions/new"
            className="group flex flex-col items-center justify-center h-full p-6 border-2 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer bg-card text-card-foreground shadow-sm"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <PlusCircle className="h-8 w-8 transition-colors group-hover:text-primary" />
              <span className="font-semibold text-center text-foreground">
                Create New Competition
              </span>
            </div>
          </Link>
          {competitions.map((comp) => (
            <Card
              key={comp.id}
              className="group flex flex-col border hover:border-primary transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">
                    {comp.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-muted-foreground ${comp.isFavorite ? "text-yellow-400" : ""}`}
                    >
                      <Star className="h-5 w-5" />
                      <span className="sr-only">Favorite</span>
                    </Button>
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
                </div>
                <Badge
                  variant={comp.type === "season" ? "secondary" : "outline"}
                  className="capitalize"
                >
                  {comp.type}
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Folder className="h-4 w-4" />
                  <span>{comp.games.length} Games</span>
                </div>
              </CardContent>
              <CardFooter className="h-10">
                <Link
                  href={`/competitions/${comp.id}/games`}
                  className="w-full flex items-center justify-center font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  View Games
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Competitions</CardTitle>
                <CardDescription>
                  Manage your seasons and tournaments.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/competitions/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Competition
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Games</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitions.length > 0 ? (
                  competitions.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-medium flex items-center">
                        {comp.name}
                        {comp.isFavorite && (
                          <Star className="h-4 w-4 ml-2 text-yellow-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={comp.type === "season" ? "secondary" : "outline"}
                        >
                          {comp.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{comp.games.length}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No competitions found.{" "}
                      <Link
                        href="/competitions/new"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>{" "}
                      to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
