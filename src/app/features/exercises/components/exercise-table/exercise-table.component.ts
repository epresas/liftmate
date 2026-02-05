import { Component, computed, input, signal, afterNextRender, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Exercise, ExerciseFilters } from '@features/exercises/types/exercise.types';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '@shared/services/storage/storage.service';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exercise-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, ExerciseFormComponent],
  templateUrl: './exercise-table.component.html',
  styleUrl: './exercise-table.component.scss'
})
export class ExerciseTableComponent {
  isReady = signal(false);
  exercisesList = input<Exercise[]>();
  private dialog = inject(MatDialog);
  private storage = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      this.isReady.set(true);
    });
  }
  filters = input<ExerciseFilters>();
  displayedColumns: string[] = ['exerciseName', 'muscleGroup', 'equipment', 'actions'];

  filteredExercises = computed(() => {
    const list = this.exercisesList() || [];
    const filters = this.filters();
    if (!filters) return list;

    return list.filter(exercise => {
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
    this.dialog.open(ExerciseFormComponent, {
      data: exercise,
      width: '400px'
    });
  }
  onDelete(exercise: Exercise) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Exercise',
        message: `Are you sure you want to delete ${exercise.name}?`,
        cancelLabel: 'Cancel',
        saveLabel: 'Delete'
      }
    }).afterClosed().subscribe(result => {
      console.log('deletion', result);
      if (result) {
        this.storage.delete('exercises', exercise.id);
      }
    });
  }
}
