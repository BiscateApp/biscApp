export interface IPortfolio {
  id: number;
  bio?: string | null;
  skills?: string | null;
  speakingLanguages?: string | null;
  stars?: number | null;
  completedTasks?: number | null;
  hourlyRate?: number | null;
}

export type NewPortfolio = Omit<IPortfolio, 'id'> & { id: null };
