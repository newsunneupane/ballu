export interface MaterialCount {
  material: string;
  count: number;
}

export interface Collection {
  id: string;
  nepaliTitle: string;
  englishTitle: string;
  pieces: string;
  materialCounts: MaterialCount[];
  glowStyle: string;
  borderColor: string;
  slug: string;
  image?: string;
}
