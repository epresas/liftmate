import { Component, computed, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MUSCLE_GROUP_OPTIONS, EXERCISE_TYPE_OPTIONS } from '@features/exercises/constants/exercises.component.constants';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { StorageService } from '@shared/services/storage/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { noNumbersValidator } from '@shared/utils/form/form.utils';
import { Exercise } from '@features/exercises/types/exercise.types';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    DialogComponent
  ],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss'
})
export class ExerciseFormComponent {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private dialogRef = inject(MatDialogRef<ExerciseFormComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  isEditMode = signal(!!this.dialogData?.id);
  title = computed(() => this.isEditMode() ? 'Edit Exercise' : 'Add Exercise');

  exerciseForm = this.fb.group({
    name: [this.dialogData?.name || '', [Validators.required, noNumbersValidator]],
    type: [this.dialogData?.type || '', Validators.required],
    muscleGroup: [this.dialogData?.muscleGroup || '', Validators.required],
  })

  muscleGroupOptions = MUSCLE_GROUP_OPTIONS;
  exerciseTypeOptions = EXERCISE_TYPE_OPTIONS;

  handleSaveForm() {
    if (!this.exerciseForm.valid) return;

    if (this.isEditMode()) {
      const updatedItem = { ...this.dialogData, ...this.exerciseForm.value } as Exercise;
      this.storage.update('exercises', updatedItem);
    } else {
      this.storage.save('exercises', this.exerciseForm.value as Exercise);
    }
    this.dialogRef.close();
  }

}
