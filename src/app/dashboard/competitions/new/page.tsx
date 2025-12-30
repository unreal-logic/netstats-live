'use client'

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCompetitions } from "@/context/CompetitionContext"

export default function NewCompetitionPage() {
  const router = useRouter();
  const { addCompetition } = useCompetitions();

  const [name, setName] = useState('');
  const [type, setType] = useState<'season' | 'tournament'>('season');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSubmit = () => {
    if (!name || !type) {
      // Basic validation
      alert('Please fill in all fields.');
      return;
    }
    addCompetition({ name, type, isFavorite });
    router.push('/dashboard/competitions');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Competition</CardTitle>
        <CardDescription>
          A competition is a collection of games, like a season or a tournament.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Competition Name</Label>
          <Input 
            id="name" 
            placeholder="e.g., Winter League 2024" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={(value: 'season' | 'tournament') => setType(value)} defaultValue={type}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select competition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="season">Season</SelectItem>
              <SelectItem value="tournament">Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="favorite-mode" 
            checked={isFavorite}
            onCheckedChange={setIsFavorite}
          />
          <Label htmlFor="favorite-mode">Mark as favorite</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/competitions">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit}>Create</Button>
      </CardFooter>
    </Card>
  )
}
