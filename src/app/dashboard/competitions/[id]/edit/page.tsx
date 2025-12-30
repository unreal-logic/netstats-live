'use client'

import { useCompetitions } from "@/context/CompetitionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function EditCompetitionPage() {
  const { competitions, updateCompetition } = useCompetitions();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const competition = useMemo(() => competitions.find(c => c.id === id), [id, competitions]);

  const [name, setName] = useState(competition?.name || "");
  const [type, setType] = useState<"season" | "tournament">(competition?.type || "season");
  const [isFavorite, setIsFavorite] = useState(competition?.isFavorite || false);

  useEffect(() => {
    // Redirect if competitions are loaded but the specific competition is not found.
    if (competitions.length > 0 && !competition) {
      router.push("/dashboard/competitions");
    }
  }, [competitions, competition, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (competition) {
      updateCompetition(competition.id, { name, type, isFavorite });
      router.push("/dashboard/competitions");
    }
  };

  if (!competition) {
    return <div>Loading...</div>;
  }

  return (
    <div key={competition.id}>
        <h1 className="text-2xl font-bold mb-6">Edit Competition</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Competition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Competition Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "season" | "tournament") => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="season">Season</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isFavorite" checked={isFavorite} onCheckedChange={setIsFavorite} />
              <Label htmlFor="isFavorite">Mark as favorite</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/competitions">Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
