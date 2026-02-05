// ========== ENUMS ==========

export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  LEGS = 'Legs',
  SHOULDERS = 'Shoulders',
  ARMS = 'Arms',
  BICEPS = 'Biceps',
  TRICEPS = 'Triceps',
  CORE = 'Core',
  FULL_BODY = 'Full Body'
}

export enum ExerciseType {
  BARBELL = 'Barbell',
  DUMBBELL = 'Dumbbell',
  BODYWEIGHT = 'Bodyweight',
  CABLE = 'Cable',
  MACHINE = 'Machine',
  TREADMILL = 'Treadmill',
  OTHER = 'Other'
}

// ========== INTERFACES ==========

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateExerciseDto {
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
}

export interface ExerciseFilters {
  searchText: string;
  muscleGroup: MuscleGroup | 'all';
}