import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ExerciseFiltersComponent } from './components/exercise-filters/exercise-filters.component';
import { ExerciseTableComponent } from './components/exercise-table/exercise-table.component';

import { ExerciseFilters } from './types/exercise.types';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [PageHeaderComponent, MatIcon, MatButton, ExerciseFiltersComponent, ExerciseTableComponent],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent {
  filters = signal<ExerciseFilters>({ searchText: '', muscleGroup: 'all' });

  onFiltersChange(filters: ExerciseFilters) {
    this.filters.set(filters);
  }

}
