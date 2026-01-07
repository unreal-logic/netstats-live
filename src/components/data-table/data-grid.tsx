'use client'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    IconStar,
    IconCircleCheckFilled,
    IconLoader
} from "@tabler/icons-react"
import { z } from "zod"
import { schema } from "@/components/data-table/data-table";
import { KebabMenu } from "@/components/data-table/kebab-menu"

type DataSchema = z.infer<typeof schema>

export function GridView({ data }: { data: DataSchema[] }) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No results.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((item) => (
                <Card key={item.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{item.header}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => item.toggleFavorite(item.id)} className={`size-8 transition-colors ${item.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground/50 hover:text-yellow-400"}`}>
                                <IconStar className={`size-4 ${item.isFavorite ? "fill-current" : ""}`} />
                                <span className="sr-only">Toggle Favorite</span>
                            </Button>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <Badge variant="outline" className="text-muted-foreground px-1.5">{item.type}</Badge>
                             <Badge variant="outline" className="text-muted-foreground px-1.5 flex items-center gap-1">
                                {item.status === "Done" ? <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> : <IconLoader className="animate-spin"/>}
                                {item.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Target</span>
                            <span>{item.target}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Limit</span>
                            <span>{item.limit}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Reviewer: </span>
                            <span>{item.reviewer}</span>
                        </div>
                        <KebabMenu />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
