
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-4">Manage Your Teams</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This is where you will create, edit, and view your teams.
      </p>
      <Button asChild>
        <Link href="/teams/new">Create Your First Team</Link>
      </Button>
    </div>
  );
}
