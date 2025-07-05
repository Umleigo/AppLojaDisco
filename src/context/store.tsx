"use client";

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Genre, Author, VinylRecord } from '@/lib/types';

interface State {
  genres: Genre[];
  authors: Author[];
  records: VinylRecord[];
}

type Action =
  | { type: 'ADD_GENRE'; payload: { name: string; description: string } }
  | { type: 'DELETE_GENRE'; payload: { id: string } }
  | { type: 'ADD_AUTHOR'; payload: { name: string } }
  | { type: 'DELETE_AUTHOR'; payload: { id: string } }
  | { type: 'ADD_RECORD'; payload: { title: string; genreId: string; authorIds: string[] } }
  | { type: 'TOGGLE_RECORD_STATUS'; payload: { id: string } };

const initialState: State = {
  genres: [
    { id: '1', name: 'Samba', description: 'Música de samba brasileira, um símbolo do país.' },
    { id: '2', name: 'Bossa Nova', description: 'Uma fusão de samba e jazz, nascida no Rio de Janeiro.' },
    { id: '3', name: 'MPB', description: 'Música Popular Brasileira, um gênero rico e diversificado.' },
    { id: '4', name: 'Rock', description: 'Música de rock clássico e alternativo.' },
  ],
  authors: [
    { id: '1', name: 'Caetano Veloso' },
  ],
  records: [
    { id: '1', title: 'Chega de Saudade', genreId: '2', authorIds: ['1'], active: true },
    { id: '2', title: 'Dois', genreId: '4', authorIds: ['1'], active: true },
    { id: '3', title: 'Transa', genreId: '3', authorIds: ['1'], active: false },
    { id: '4', title: 'Elis & Tom', genreId: '3', authorIds: ['1'], active: true },
  ],
};

const storeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_GENRE':
      const newGenre: Genre = { ...action.payload, id: crypto.randomUUID() };
      return { ...state, genres: [...state.genres, newGenre] };
    case 'DELETE_GENRE':
      return { ...state, genres: state.genres.filter(g => g.id !== action.payload.id) };
    case 'ADD_AUTHOR':
      const newAuthor: Author = { ...action.payload, id: crypto.randomUUID() };
      return { ...state, authors: [...state.authors, newAuthor] };
    case 'DELETE_AUTHOR':
      return { ...state, authors: state.authors.filter(a => a.id !== action.payload.id) };
    case 'ADD_RECORD':
      const newRecord: VinylRecord = { ...action.payload, id: crypto.randomUUID(), active: true };
      return { ...state, records: [...state.records, newRecord] };
    case 'TOGGLE_RECORD_STATUS':
      return {
        ...state,
        records: state.records.map(r =>
          r.id === action.payload.id ? { ...r, active: !r.active } : r
        ),
      };
    default:
      return state;
  }
};

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
