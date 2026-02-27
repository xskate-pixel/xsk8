import { Trick, Student, TrickLevel } from './types';

export const TRICKS: Trick[] = [
  { id: '1', name: 'Ollie', category: 'Flat', difficulty: 1 },
  { id: '2', name: 'Shove-it', category: 'Flat', difficulty: 2 },
  { id: '3', name: 'Kickflip', category: 'Flip', difficulty: 4 },
  { id: '4', name: 'Heelflip', category: 'Flip', difficulty: 4 },
  { id: '5', name: 'Boardslide', category: 'Grind', difficulty: 3 },
  { id: '6', name: '50-50 Grind', category: 'Grind', difficulty: 4 },
  { id: '7', name: '360 Flip', category: 'Flip', difficulty: 7 },
  { id: '8', name: 'Indy Grab', category: 'Grab', difficulty: 3 },
  { id: '9', name: 'Dropping In', category: 'Transition', difficulty: 2 },
  { id: '10', name: 'Rock to Fakie', category: 'Transition', difficulty: 4 },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Lucas Silva',
    nickname: 'Lukinha',
    photoUrl: 'https://picsum.photos/seed/skater1/400/400',
    level: TrickLevel.INTERMEDIATE,
    points: 1250,
    rank: 1,
    bio: 'Focado em street e manobras de flip.',
    tricks: [
      { trickId: '1', status: 'mastered', dateLearned: '2023-01-15' },
      { trickId: '2', status: 'mastered', dateLearned: '2023-02-10' },
      { trickId: '3', status: 'learned', dateLearned: '2023-05-20' },
      { trickId: '5', status: 'learning' },
    ]
  },
  {
    id: 's2',
    name: 'Beatriz Santos',
    nickname: 'Bia',
    photoUrl: 'https://picsum.photos/seed/skater2/400/400',
    level: TrickLevel.BEGINNER,
    points: 850,
    rank: 3,
    bio: 'Iniciando nas transições.',
    tricks: [
      { trickId: '1', status: 'mastered', dateLearned: '2023-03-01' },
      { trickId: '9', status: 'learned', dateLearned: '2023-04-15' },
      { trickId: '2', status: 'learning' },
    ]
  },
  {
    id: 's3',
    name: 'Gabriel Oliveira',
    nickname: 'Biel',
    photoUrl: 'https://picsum.photos/seed/skater3/400/400',
    level: TrickLevel.ADVANCED,
    points: 2100,
    rank: 2,
    bio: 'Especialista em corrimão.',
    tricks: [
      { trickId: '1', status: 'mastered' },
      { trickId: '2', status: 'mastered' },
      { trickId: '3', status: 'mastered' },
      { trickId: '5', status: 'mastered' },
      { trickId: '6', status: 'learned' },
      { trickId: '7', status: 'learning' },
    ]
  }
];
