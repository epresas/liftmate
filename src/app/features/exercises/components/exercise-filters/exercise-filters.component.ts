import { Component, input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { ExerciseFilters, MuscleGroup } from '@features/exercises/types/exercise.types';

@Component({
  selector: 'app-exercise-filters',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './exercise-filters.component.html',
  styleUrl: './exercise-filters.component.scss'
})
export class ExerciseFiltersComponent {
  filters = input.required<ExerciseFilters>();
  @Output() filtersChange = new EventEmitter<ExerciseFilters>();

  exerciseTypes = [
    { value: MuscleGroup.CHEST, viewValue: 'Chest' },
    { value: MuscleGroup.BACK, viewValue: 'Back' },
    { value: MuscleGroup.LEGS, viewValue: 'Legs' },
    { value: MuscleGroup.SHOULDERS, viewValue: 'Shoulders' },
    { value: MuscleGroup.ARMS, viewValue: 'Arms' },
    { value: MuscleGroup.CORE, viewValue: 'Core' },
    { value: MuscleGroup.FULL_BODY, viewValue: 'Full Body' },
  ];

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), searchText: target.value });
  }

  onMuscleGroupChange(value: MuscleGroup | 'all') {
    this.filtersChange.emit({ ...this.filters(), muscleGroup: value });
  }

  clearSearch() {
    this.filtersChange.emit({ ...this.filters(), searchText: '' });
  }
}
