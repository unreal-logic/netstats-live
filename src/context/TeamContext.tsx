'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Player {
  id: string;
  name: string;
  position: string;
}

export interface Team {
  id: string;
  name: string;
  isFavorite: boolean;
  players: Player[];
}

interface TeamContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: { name: string; isFavorite: boolean }) => void;
  updateTeam: (id: string, updatedTeam: Partial<Omit<Team, 'id'>>) => void;
  deleteTeam: (id: string) => void;
  toggleFavorite: (id: string, isFavorite: boolean) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const sampleTeams: Team[] = [
    {
        id: "1",
        name: "Thunderbolts",
        isFavorite: true,
        players: [],
    },
    {
        id: "2",
        name: "Mystics",
        isFavorite: false,
        players: [],
    },
];

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : sampleTeams;
    } catch (error) {
        console.error("Failed to parse teams from localStorage", error);
        return sampleTeams;
    }
  });

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  const addTeam = (team: { name: string; isFavorite: boolean }) => {
    setTeams(prev => [...prev, { ...team, id: Date.now().toString(), players: [] }]);
  };

  const updateTeam = (id: string, updatedTeam: Partial<Omit<Team, 'id'>>) => {
    setTeams(prev => prev.map(t => (t.id === id ? { ...t, ...updatedTeam } : t)));
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (id: string, isFavorite: boolean) => {
    setTeams(prev => prev.map(t => (t.id === id ? { ...t, isFavorite: !isFavorite } : t)));
  };

  return (
    <TeamContext.Provider value={{ teams, setTeams, addTeam, updateTeam, deleteTeam, toggleFavorite }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};
