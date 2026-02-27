export enum TrickLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
  PRO = 'Profissional'
}

export interface Trick {
  id: string;
  name: string;
  category: 'Flat' | 'Grind' | 'Flip' | 'Grab' | 'Transition';
  difficulty: number; // 1-10
}

export interface StudentTrick {
  trickId: string;
  status: 'learned' | 'learning' | 'mastered';
  dateLearned?: string;
}

export interface Student {
  id: string;
  name: string;
  nickname?: string;
  photoUrl: string;
  level: TrickLevel;
  tricks: StudentTrick[];
  points: number;
  rank: number;
  bio?: string;
}
