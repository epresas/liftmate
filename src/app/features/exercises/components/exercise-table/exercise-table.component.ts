import { Component, computed, input, signal, afterNextRender } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Exercise, MuscleGroup, ExerciseType, ExerciseFilters } from '@features/exercises/types/exercise.types';

const EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    muscleGroup: MuscleGroup.CHEST,
    type: ExerciseType.BARBELL,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: MuscleGroup.SHOULDERS,
    type: ExerciseType.DUMBBELL,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Barbell Squat',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.BARBELL,
    createdAt: new Date(),
  },
];

@Component({
  selector: 'app-exercise-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './exercise-table.component.html',
  styleUrl: './exercise-table.component.scss'
})
export class ExerciseTableComponent {
  isReady = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isReady.set(true);
    });
  }
  filters = input<ExerciseFilters>();
  displayedColumns: string[] = ['exerciseName', 'muscleGroup', 'equipment', 'actions'];

  filteredExercises = computed(() => {
    const filters = this.filters();
    if (!filters) return EXERCISES;

    return EXERCISES.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(filters.searchText.toLowerCase());
      const matchesMuscleGroup = filters.muscleGroup === 'all' || exercise.muscleGroup === filters.muscleGroup;
      return matchesSearch && matchesMuscleGroup;
    });
  });

  filterValue = computed(() => {
    const f = this.filters();
    if (!f) return '';
    return f.searchText || (f.muscleGroup !== 'all' ? f.muscleGroup : '');
  });

  onEdit(exercise: Exercise) {
    console.log('Editing exercise:', exercise);
  }

  onDelete(exercise: Exercise) {
    console.log('Deleting exercise:', exercise);
  }
}
