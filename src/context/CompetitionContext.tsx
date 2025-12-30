'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. DEFINE THE TYPES

export interface Competition {
  id: string;
  name: string;
  type: 'season' | 'tournament';
  games: unknown[]; // Replace 'any' with a proper Game type later
  isFavorite: boolean;
}

interface CompetitionContextType {
  competitions: Competition[];
  setCompetitions: React.Dispatch<React.SetStateAction<Competition[]>>;
  addCompetition: (competition: Omit<Competition, 'id' | 'games'>) => void;
  deleteCompetition: (id: string) => void;
  updateCompetition: (id: string, updatedCompetition: Partial<Competition>) => void;
}

// 2. CREATE THE CONTEXT

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

// 3. CREATE THE PROVIDER COMPONENT

export const CompetitionProvider = ({ children }: { children: ReactNode }) => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);

    useEffect(() => {
        try {
            const savedCompetitions = localStorage.getItem('competitions');
            if (savedCompetitions) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCompetitions(JSON.parse(savedCompetitions));
            }
        } catch (error) {
            console.error("Failed to parse competitions from localStorage", error);
        }
    }, []);

    useEffect(() => {
        // Prevents saving the initial empty array to localStorage on first render.
        if (competitions.length > 0) {
            localStorage.setItem('competitions', JSON.stringify(competitions));
        }
    }, [competitions]);

  const addCompetition = (competition: Omit<Competition, 'id' | 'games'>) => {
    const newCompetition: Competition = {
      ...competition,
      id: new Date().toISOString(), // Simple unique ID
      games: [],
    };
    setCompetitions(prev => [...prev, newCompetition]);
  };

  const deleteCompetition = (id: string) => {
    setCompetitions(prev => prev.filter(comp => comp.id !== id));
  };

  const updateCompetition = (id: string, updatedCompetition: Partial<Competition>) => {
    setCompetitions(prev =>
      prev.map(comp =>
        comp.id === id ? { ...comp, ...updatedCompetition } : comp
      )
    );
  };

  return (
    <CompetitionContext.Provider value={{ competitions, setCompetitions, addCompetition, deleteCompetition, updateCompetition }}>
      {children}
    </CompetitionContext.Provider>
  );
};

// 4. CREATE A CUSTOM HOOK FOR EASY ACCESS

export const useCompetitions = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetitions must be used within a CompetitionProvider');
  }
  return context;
};
