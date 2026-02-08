import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExerciseTableComponent } from './exercise-table.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '@shared/services/storage/storage.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MuscleGroup, ExerciseType, Exercise } from '@features/exercises/types/exercise.types';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

describe('features > exercises > components > ExerciseTableComponent', () => {
  let component: ExerciseTableComponent;
  let fixture: ComponentFixture<ExerciseTableComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Bench Press',
      muscleGroup: MuscleGroup.CHEST,
      type: ExerciseType.BARBELL,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Squat',
      muscleGroup: MuscleGroup.LEGS,
      type: ExerciseType.BARBELL,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Pull Up',
      muscleGroup: MuscleGroup.BACK,
      type: ExerciseType.BODYWEIGHT,
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    storageSpy = jasmine.createSpyObj('StorageService', ['delete']);

    await TestBed.configureTestingModule({
      imports: [
        ExerciseTableComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    })
      .overrideComponent(ExerciseTableComponent, {
        remove: { imports: [ExerciseFormComponent] },
        add: { imports: [] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('exercisesList', mockExercises);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isReady to true after render', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.isReady()).toBeTrue();
  }));

  describe('Filtering Logic', () => {
    it('should return all exercises if no filters are provided', () => {
      fixture.componentRef.setInput('filters', undefined);
      fixture.detectChanges();
      expect(component.filteredExercises().length).toBe(3);
    });

    it('should filter by search text (case-insensitive)', () => {
      fixture.componentRef.setInput('filters', { searchText: 'bench', muscleGroup: 'all' });
      fixture.detectChanges();
      const filtered = component.filteredExercises();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Bench Press');
    });

    it('should filter by muscle group', () => {
      fixture.componentRef.setInput('filters', { searchText: '', muscleGroup: MuscleGroup.LEGS });
      fixture.detectChanges();
      const filtered = component.filteredExercises();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Squat');
    });

    it('should combine search text and muscle group filters', () => {
      fixture.componentRef.setInput('filters', { searchText: 'Up', muscleGroup: MuscleGroup.BACK });
      fixture.detectChanges();
      const filtered = component.filteredExercises();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Pull Up');
    });

    it('should return empty list if search does not match muscle group', () => {
      fixture.componentRef.setInput('filters', { searchText: 'Bench', muscleGroup: MuscleGroup.LEGS });
      fixture.detectChanges();
      expect(component.filteredExercises().length).toBe(0);
    });
  });

  describe('User Actions', () => {
    it('should open ExerciseFormComponent on edit', () => {
      const exercise = mockExercises[0];
      component.onEdit(exercise);

      expect(dialogSpy.open).toHaveBeenCalledWith(ExerciseFormComponent, jasmine.objectContaining({
        data: exercise,
        width: '400px'
      }));
    });

    it('should open ConfirmDialogComponent on delete', () => {
      const exercise = mockExercises[0];
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(true)
      } as any);

      component.onDelete(exercise);

      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({
          title: 'Delete Exercise',
          message: jasmine.stringMatching(exercise.name)
        })
      }));
    });

    it('should call storage.delete if deletion is confirmed', () => {
      const exercise = mockExercises[0];
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(true)
      } as any);

      component.onDelete(exercise);

      expect(storageSpy.delete).toHaveBeenCalledWith('exercises', exercise.id);
    });

    it('should NOT call storage.delete if deletion is cancelled', () => {
      const exercise = mockExercises[0];
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(false)
      } as any);

      component.onDelete(exercise);

      expect(storageSpy.delete).not.toHaveBeenCalled();
    });
  });
});
