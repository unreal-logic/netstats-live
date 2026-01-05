import { z } from "zod"

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  type: z.enum(["indoor", "outdoor"]),
})

export type Venue = z.infer<typeof venueSchema>
