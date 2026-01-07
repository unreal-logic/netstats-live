'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import sampleCompetitions from '@/lib/data/competitions.json'

// Define the structure of a Competition
export interface Competition {
  id: string
  name: string
  isFavorite: boolean
  gameCount: number
  // Add any other properties relevant to a competition
}

// Define the shape of the context
interface CompetitionContextType {
  competitions: Competition[]
  setCompetitions: React.Dispatch<React.SetStateAction<Competition[]>>
  addCompetition: (competition: Omit<Competition, 'id'>) => void
  deleteCompetition: (id: string) => void
  updateCompetition: (
    id: string,
    updatedCompetition: Partial<Omit<Competition, 'id'>>
  ) => void
}

// Create the context
const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
)

// Custom hook to use the Competition context
export const useCompetitions = () => {
  const context = useContext(CompetitionContext)
  if (!context) {
    throw new Error(
      "useCompetitions must be used within a CompetitionProvider"
    )
  }
  return context
}

// Create the provider component
export const CompetitionProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state lazily from localStorage
  const [competitions, setCompetitions] = useState<Competition[]>(() => {
    try {
      // This code only runs on the client, so we can safely use localStorage
      const savedCompetitions = localStorage.getItem('competitions')
      if (savedCompetitions) {
        return JSON.parse(savedCompetitions)
      }
    } catch (error) {
      console.error("Failed to parse competitions from localStorage", error)
    }
    // Return sample data if nothing is saved or if an error occurred
    return sampleCompetitions
  })

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('competitions', JSON.stringify(competitions))
    } catch (error) {
      console.error("Failed to save competitions to localStorage", error)
    }
  }, [competitions])


  const addCompetition = (competition: Omit<Competition, 'id'>) => {
    const newCompetition: Competition = {
      ...competition,
      id: `comp-${Date.now()}`,
    }
    setCompetitions(prev => [...prev, newCompetition])
  }

  const updateCompetition = (
    id: string,
    updatedCompetition: Partial<Omit<Competition, 'id'>>
  ) => {
    setCompetitions(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updatedCompetition } : c))
    )
  }

  const deleteCompetition = (id: string) => {
    setCompetitions(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CompetitionContext.Provider
      value={{
        competitions,
        setCompetitions,
        addCompetition,
        deleteCompetition,
        updateCompetition,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  )
}
