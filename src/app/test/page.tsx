'use client'

import { useState, useMemo } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { GridView } from "@/components/data-table/data-grid"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconLayoutGrid, IconList, IconStar } from "@tabler/icons-react"
import { PlusCircle } from "lucide-react"

import initialData from "./data.json"

export default function Page() {
  const [data, setData] = useState(initialData);
  const [showFavorites, setShowFavorites] = useState(false);
  const [view, setView] = useState('list');

  const toggleFavorite = (id: number) => {
    setData(currentData => 
      currentData.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredData = useMemo(() => {
    let result = data.map(item => ({
      ...item,
      toggleFavorite: toggleFavorite,
    }));

    if (showFavorites) {
      result = result.filter(item => item.isFavorite);
    }

    return result;
  }, [data, showFavorites]);

  return (
    <div className="flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="competitions">Competitions</SelectItem>
              <SelectItem value="teams">Teams</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setShowFavorites(!showFavorites)} className={showFavorites ? "text-yellow-400 border-yellow-400" : ""}>
            <IconStar className={`mr-2 size-4 ${showFavorites ? "fill-current" : ""}`} />
            Favorites
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <Button variant={view === 'list' ? "secondary" : "ghost"} size="icon" onClick={() => setView('list')}>
              <IconList className="size-4" />
              <span className="sr-only">List View</span>
            </Button>
            <Button variant={view === 'grid' ? "secondary" : "ghost"} size="icon" onClick={() => setView('grid')}>
              <IconLayoutGrid className="size-4" />
              <span className="sr-only">Grid View</span>
            </Button>
          </div>
          <Button>
            <PlusCircle className="mr-2 size-4" />
            New Competition
          </Button>
        </div>
      </div>
      {view === 'list' ? <DataTable data={filteredData} /> : <GridView data={filteredData} />}
    </div>
  )
}
