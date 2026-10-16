export interface DefaultExerciseDef {
  name: string;
  category: string;
  equipment: string;
}

export const DEFAULT_EXERCISES: DefaultExerciseDef[] = [
  // Chest
  { name: 'Flat Barbell Bench Press', category: 'Chest', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbell' },
  { name: 'Flat Dumbbell Press', category: 'Chest', equipment: 'Dumbbell' },
  { name: 'Incline Barbell Bench Press', category: 'Chest', equipment: 'Barbell' },
  { name: 'Chest Dips', category: 'Chest', equipment: 'Bodyweight' },
  { name: 'Dumbbell Flyes', category: 'Chest', equipment: 'Dumbbell' },
  { name: 'Pec Deck Fly (Machine)', category: 'Chest', equipment: 'Machine' },
  { name: 'Cable Crossover', category: 'Chest', equipment: 'Cable' },
  { name: 'Machine Chest Press', category: 'Chest', equipment: 'Machine' },

  // Back
  { name: 'Conventional Deadlift', category: 'Back', equipment: 'Barbell' },
  { name: 'Pull-ups (Overhand)', category: 'Back', equipment: 'Bodyweight' },
  { name: 'Chin-ups (Underhand)', category: 'Back', equipment: 'Bodyweight' },
  { name: 'Bent-Over Barbell Row', category: 'Back', equipment: 'Barbell' },
  { name: 'One-Arm Dumbbell Row', category: 'Back', equipment: 'Dumbbell' },
  { name: 'Lat Pulldown', category: 'Back', equipment: 'Cable' },
  { name: 'Seated Cable Row', category: 'Back', equipment: 'Cable' },
  { name: 'T-Bar Row', category: 'Back', equipment: 'Machine' },
  { name: 'Barbell / Dumbbell Shrugs', category: 'Back', equipment: 'Barbell' },
  { name: 'Back Extensions (Hyperextensions)', category: 'Back', equipment: 'Bodyweight' },

  // Legs
  { name: 'Barbell Back Squat', category: 'Legs', equipment: 'Barbell' },
  { name: 'Barbell Front Squat', category: 'Legs', equipment: 'Barbell' },
  { name: 'Leg Press', category: 'Legs', equipment: 'Machine' },
  { name: 'Romanian Deadlift (RDL)', category: 'Legs', equipment: 'Barbell' },
  { name: 'Dumbbell Romanian Deadlift', category: 'Legs', equipment: 'Dumbbell' },
  { name: 'Hack Squat', category: 'Legs', equipment: 'Machine' },
  { name: 'Walking Dumbbell Lunges', category: 'Legs', equipment: 'Dumbbell' },
  { name: 'Leg Extensions', category: 'Legs', equipment: 'Machine' },
  { name: 'Lying Leg Curls', category: 'Legs', equipment: 'Machine' },
  { name: 'Standing Calf Raises', category: 'Legs', equipment: 'Machine' },
  { name: 'Seated Calf Raises', category: 'Legs', equipment: 'Machine' },
  { name: 'Barbell Hip Thrust', category: 'Legs', equipment: 'Barbell' },

  // Shoulders
  { name: 'Overhead Press (OHP)', category: 'Shoulders', equipment: 'Barbell' },
  { name: 'Seated Dumbbell Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Dumbbell Lateral Raises', category: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Bent-Over Dumbbell Rear Delt Raises', category: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Face Pulls', category: 'Shoulders', equipment: 'Cable' },
  { name: 'Reverse Pec Deck (Rear Delt Fly)', category: 'Shoulders', equipment: 'Machine' },
  { name: 'Cable Lateral Raises', category: 'Shoulders', equipment: 'Cable' },

  // Arms (Biceps & Triceps)
  { name: 'Barbell Biceps Curl', category: 'Arms', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Curl with Supination', category: 'Arms', equipment: 'Dumbbell' },
  { name: 'Dumbbell Hammer Curls', category: 'Arms', equipment: 'Dumbbell' },
  { name: 'Preacher Curl', category: 'Arms', equipment: 'Barbell' },
  { name: 'Triceps Rope Pushdown', category: 'Arms', equipment: 'Cable' },
  { name: 'Skull Crushers (Lying Triceps Ext)', category: 'Arms', equipment: 'Barbell' },
  { name: 'Close-Grip Bench Press', category: 'Arms', equipment: 'Barbell' },
  { name: 'Overhead Cable Triceps Extension', category: 'Arms', equipment: 'Cable' },
  { name: 'Triceps Dips', category: 'Arms', equipment: 'Bodyweight' },

  // Core
  { name: 'Hanging Leg Raises', category: 'Core', equipment: 'Bodyweight' },
  { name: 'Cable Kneeling Crunch', category: 'Core', equipment: 'Cable' },
  { name: 'Plank', category: 'Core', equipment: 'Bodyweight' },
  { name: 'Machine Ab Crunch', category: 'Core', equipment: 'Machine' },
  { name: 'Ab Wheel Rollout', category: 'Core', equipment: 'Bodyweight' },
];

export const EXERCISE_CATEGORIES = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
] as const;

export type ExerciseCategoryFilter = typeof EXERCISE_CATEGORIES[number];

