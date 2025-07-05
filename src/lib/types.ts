export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface VinylRecord {
  id: string;
  title: string;
  genreId: string;
  authorIds: string[];
  active: boolean;
}
