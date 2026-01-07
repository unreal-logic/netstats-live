'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import samplePlayers from '@/lib/data/players.json'

export interface Player {
  id: string
  name: string
  position: string
  isFavorite?: boolean // Added isFavorite to the Player interface
  // Add any other relevant player properties
}

interface PlayerContextType {
  players: Player[]
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  addPlayer: (player: Omit<Player, 'id' | 'isFavorite'>) => void
  deletePlayer: (id: string) => void
  updatePlayer: (id: string, updatedPlayer: Partial<Omit<Player, 'id'>>) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const usePlayers = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayers must be used within a PlayerProvider")
  }
  return context
}

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state lazily from localStorage
  const [players, setPlayers] = useState<Player[]>(() => {
    // Ensure this code only runs on the client
    if (typeof window === 'undefined') {
      return samplePlayers
    }
    try {
      const savedPlayers = localStorage.getItem('players')
      return savedPlayers ? JSON.parse(savedPlayers) : samplePlayers
    } catch (error) {
      console.error("Failed to parse players from localStorage", error)
      return samplePlayers
    }
  })

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('players', JSON.stringify(players))
    } catch (error) {
      console.error("Failed to save players to localStorage", error)
    }
  }, [players])

  const addPlayer = (player: Omit<Player, 'id' | 'isFavorite'>) => {
    const newPlayer: Player = {
      ...player,
      id: `player-${Date.now()}`,
      isFavorite: false, // Default isFavorite to false
    }
    setPlayers(prev => [...prev, newPlayer])
  }

  const updatePlayer = (id: string, updatedPlayer: Partial<Omit<Player, 'id'>>) => {
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedPlayer } : p))
    )
  }

  const deletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  return (
    <PlayerContext.Provider
      value={{ players, setPlayers, addPlayer, deletePlayer, updatePlayer }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
