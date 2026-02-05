import { Exercise, ExerciseType, MuscleGroup } from "../types/exercise.types";

const now = new Date();

export const EXERCISES: Exercise[] = [
  { id: crypto.randomUUID(), name: "Bench Press", muscleGroup: MuscleGroup.CHEST, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Squat", muscleGroup: MuscleGroup.LEGS, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Deadlift", muscleGroup: MuscleGroup.BACK, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Overhead Press", muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Barbell Row", muscleGroup: MuscleGroup.BACK, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Pull-ups", muscleGroup: MuscleGroup.BACK, type: ExerciseType.BODYWEIGHT, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Dumbbell Curl", muscleGroup: MuscleGroup.BICEPS, type: ExerciseType.DUMBBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Tricep Pushdown", muscleGroup: MuscleGroup.TRICEPS, type: ExerciseType.CABLE, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Leg Press", muscleGroup: MuscleGroup.LEGS, type: ExerciseType.MACHINE, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Lat Pulldown", muscleGroup: MuscleGroup.BACK, type: ExerciseType.CABLE, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Incline Dumbbell Press", muscleGroup: MuscleGroup.CHEST, type: ExerciseType.DUMBBELL, createdAt: now, updatedAt: now },
  { id: crypto.randomUUID(), name: "Romanian Deadlift", muscleGroup: MuscleGroup.LEGS, type: ExerciseType.BARBELL, createdAt: now, updatedAt: now },
];

export const MUSCLE_GROUP_OPTIONS = Object.entries(MuscleGroup).map(([key, value]) => ({
  id: key,
  label: value,
  value,
}));

export const EXERCISE_TYPE_OPTIONS = Object.entries(ExerciseType).map(([key, value]) => ({
  id: key,
  label: value,
  value,
}));