import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ExerciseFiltersComponent } from './components/exercise-filters/exercise-filters.component';
import { ExerciseTableComponent } from './components/exercise-table/exercise-table.component';

import { StorageService } from '@shared/services/storage/storage.service';

import { Exercise, ExerciseFilters } from './types/exercise.types';

import { EXERCISES } from './constants/exercises.component.constants';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [PageHeaderComponent, MatIcon, MatButton, ExerciseFiltersComponent, ExerciseTableComponent, CommonModule, DialogComponent],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent {
  private storage = inject(StorageService);
  private dialog = inject(MatDialog);

  exercises$ = this.storage.watch$<Exercise>('exercises', EXERCISES);
  filters = signal<ExerciseFilters>({ searchText: '', muscleGroup: 'all' });

  onFiltersChange(filters: ExerciseFilters) {
    this.filters.set(filters);
  }

  openExerciseDialog() {
    this.dialog.open(ExerciseFormComponent, { width: '500px' });
  }

}
