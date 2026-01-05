'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. DEFINE THE TYPES

export interface Venue {
  id: string;
  name: string;
  location: string;
  type: 'indoor' | 'outdoor';
  isFavorite: boolean;
}

interface VenueContextType {
  venues: Venue[];
  setVenues: React.Dispatch<React.SetStateAction<Venue[]>>;
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  deleteVenue: (id: string) => void;
  updateVenue: (id: string, updatedVenue: Partial<Venue>) => void;
}

// 2. CREATE THE CONTEXT

const VenueContext = createContext<VenueContextType | undefined>(undefined);

// 3. CREATE THE PROVIDER COMPONENT

const sampleVenues: Venue[] = [
  {
    id: '1',
    name: 'Netball Central',
    location: 'Sydney Olympic Park',
    type: 'indoor',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Heffron Centre',
    location: 'Maroubra',
    type: 'indoor',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Ku-ring-gai Netball Association',
    location: 'Hornsby',
    type: 'outdoor',
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Northern Suburbs Netball Association',
    location: 'Willoughby',
    type: 'outdoor',
    isFavorite: false,
  },
];

export const VenueProvider = ({ children }: { children: ReactNode }) => {
    const [venues, setVenues] = useState<Venue[]>(() => {
        try {
            const savedVenues = localStorage.getItem('venues');
            return savedVenues ? JSON.parse(savedVenues) : sampleVenues;
        } catch (error) {
            console.error("Failed to parse venues from localStorage", error);
            return sampleVenues;
        }
    });

    useEffect(() => {
        // Prevents saving the initial empty array to localStorage on first render.
        if (venues.length > 0) {
            localStorage.setItem('venues', JSON.stringify(venues));
        }
    }, [venues]);

  const addVenue = (venue: Omit<Venue, 'id'>) => {
    const newVenue: Venue = {
      ...venue,
      id: new Date().toISOString(), // Simple unique ID
    };
    setVenues(prev => [...prev, newVenue]);
  };

  const deleteVenue = (id: string) => {
    setVenues(prev => prev.filter(v => v.id !== id));
    // If all venues are deleted, remove the item from local storage
    if (venues.length === 1) {
        localStorage.removeItem('venues');
    }
  };

  const updateVenue = (id: string, updatedVenue: Partial<Venue>) => {
    setVenues(prev =>
      prev.map(v =>
        v.id === id ? { ...v, ...updatedVenue } : v
      )
    );
  };

  return (
    <VenueContext.Provider value={{ venues, setVenues, addVenue, deleteVenue, updateVenue }}>
      {children}
    </VenueContext.Provider>
  );
};

// 4. CREATE A CUSTOM HOOK FOR EASY ACCESS

export const useVenues = () => {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error('useVenues must be used within a VenueProvider');
  }
  return context;
};
