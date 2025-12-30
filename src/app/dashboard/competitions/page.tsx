'use client'

import Link from "next/link"
import { MoreHorizontal, PlusCircle, Star } from "lucide-react"
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
  const { competitions, deleteCompetition } = useCompetitions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const handleDeleteClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCompetition) {
      deleteCompetition(selectedCompetition.id);
      setSelectedCompetition(null);
    }
    setDialogOpen(false);
  };

  return (
    <>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Competitions</h1>
          <Button asChild>
            <Link href="/dashboard/competitions/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Competition
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Competitions</CardTitle>
            <CardDescription>
              Manage your seasons and tournaments.
            </CardDescription>
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
                        <Badge variant={comp.type === "season" ? "secondary" : "outline"}>
                          {comp.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{comp.games.length}</TableCell>
                      <TableCell>
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
                               <Link href={`/dashboard/competitions/${comp.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(comp)} className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No competitions found. <Link href="/dashboard/competitions/new" className="text-primary hover:underline">Create one</Link> to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <span className="font-bold">{selectedCompetition?.name}</span>
              {' '} competition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
