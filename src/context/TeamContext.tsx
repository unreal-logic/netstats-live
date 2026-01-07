'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import sampleTeams from '@/lib/data/teams.json'
import { Player } from './PlayerContext' // Assuming Player type is exported from PlayerContext

export interface Team {
  id: string
  name: string
  isFavorite: boolean
  players: Player[]
}

interface TeamContextType {
  teams: Team[]
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
  addTeam: (team: Omit<Team, 'id' | 'players' | 'isFavorite'>) => void
  deleteTeam: (id: string) => void
  updateTeam: (id: string, updatedTeam: Partial<Omit<Team, 'id'>>) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export const useTeams = () => {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error("useTeams must be used within a TeamProvider")
  }
  return context
}

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state lazily from localStorage
  const [teams, setTeams] = useState<Team[]>(() => {
    if (typeof window === 'undefined') {
      return sampleTeams
    }
    try {
      const savedTeams = localStorage.getItem('teams')
      return savedTeams ? JSON.parse(savedTeams) : sampleTeams
    } catch (error) {
      console.error("Failed to parse teams from localStorage", error)
      return sampleTeams
    }
  })

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('teams', JSON.stringify(teams))
    } catch (error) {
      console.error("Failed to save teams to localStorage", error)
    }
  }, [teams])

  const addTeam = (team: Omit<Team, 'id' | 'players' | 'isFavorite'>) => {
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now().toString()}`,
      isFavorite: false,
      players: [],
    }
    setTeams(prev => [...prev, newTeam])
  }

  const updateTeam = (id: string, updatedTeam: Partial<Omit<Team, 'id'>>) => {
    setTeams(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updatedTeam } : t))
    )
  }

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id))
  }

  return (
    <TeamContext.Provider
      value={{ teams, setTeams, addTeam, deleteTeam, updateTeam }}
    >
      {children}
    </TeamContext.Provider>
  )
}
