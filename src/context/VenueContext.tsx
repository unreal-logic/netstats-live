'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import sampleVenues from '@/lib/data/venues.json'

export interface Venue {
  id: string
  name: string
  location: string
  type: 'indoor' | 'outdoor'
  isFavorite?: boolean
}

interface VenueContextType {
  venues: Venue[]
  setVenues: React.Dispatch<React.SetStateAction<Venue[]>>
  addVenue: (venue: Omit<Venue, 'id' | 'isFavorite'>) => void
  deleteVenue: (id: string) => void
  updateVenue: (id: string, updatedVenue: Partial<Omit<Venue, 'id'>>) => void
}

const VenueContext = createContext<VenueContextType | undefined>(undefined)

export const useVenues = () => {
  const context = useContext(VenueContext)
  if (!context) {
    throw new Error("useVenues must be used within a VenueProvider")
  }
  return context
}

export const VenueProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state lazily from localStorage
  const [venues, setVenues] = useState<Venue[]>(() => {
    if (typeof window === 'undefined') {
      return sampleVenues
    }
    try {
      const savedVenues = localStorage.getItem('venues')
      return savedVenues ? JSON.parse(savedVenues) : sampleVenues
    } catch (error) {
      console.error("Failed to parse venues from localStorage", error)
      return sampleVenues
    }
  })

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('venues', JSON.stringify(venues))
    } catch (error) {
      console.error("Failed to save venues to localStorage", error)
    }
  }, [venues])

  const addVenue = (venue: Omit<Venue, 'id' | 'isFavorite'>) => {
    const newVenue: Venue = {
      ...venue,
      id: `venue-${Date.now()}`,
      isFavorite: false,
    }
    setVenues(prev => [...prev, newVenue])
  }

  const updateVenue = (id: string, updatedVenue: Partial<Omit<Venue, 'id'>>) => {
    setVenues(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updatedVenue } : v))
    )
  }

  const deleteVenue = (id: string) => {
    setVenues(prev => prev.filter(v => v.id !== id))
  }

  return (
    <VenueContext.Provider
      value={{ venues, setVenues, addVenue, deleteVenue, updateVenue }}
    >
      {children}
    </VenueContext.Provider>
  )
}
