# Estrategia de Implementación: Exercises Feature

## 📋 Visión General

Esta feature permitirá a los usuarios gestionar su biblioteca de ejercicios con capacidades de CRUD completas, filtrado avanzado y persistencia local mediante localStorage.

![Referencia de diseño](/Users/edmundopresas/.gemini/antigravity/brain/bb858ff5-1299-4020-ad70-0f538e5461fe/uploaded_media_1769975432000.png)

---

## 🏗️ Arquitectura: Container/Presentational Pattern

### **Container Component** (`exercises.component.ts`)
- **Responsabilidad**: Orquestación, lógica de negocio y comunicación con servicios
- **No contiene**: UI compleja, solo composición de componentes presentacionales
- **Gestiona**:
  - Estado de la lista de ejercicios
  - Operaciones CRUD (Create, Read, Update, Delete)
  - Filtrado y búsqueda
  - Apertura/cierre de diálogos
  - Interacción con `ExerciseStorageService`

### **Presentational Components** (`components/`)
- **Responsabilidad**: UI pura, reciben datos vía `@Input()` y emiten eventos vía `@Output()`
- **No contienen**: Lógica de negocio, llamadas a servicios
- **Principio**: Reutilizables, testeables, predecibles

---

## 📁 Estructura de Archivos Propuesta

```
src/app/features/exercises/
├── exercises.component.ts          # Container (Smart Component)
├── exercises.component.html        # Template del container
├── exercises.component.scss        # Estilos del container
├── exercises.routes.ts             # Rutas
│
├── components/                     # Presentational Components
│   ├── exercise-header/
│   │   ├── exercise-header.component.ts
│   │   ├── exercise-header.component.html
│   │   └── exercise-header.component.scss
│   │
│   ├── exercise-filters/
│   │   ├── exercise-filters.component.ts
│   │   ├── exercise-filters.component.html
│   │   └── exercise-filters.component.scss
│   │
│   ├── exercise-table/
│   │   ├── exercise-table.component.ts
│   │   ├── exercise-table.component.html
│   │   └── exercise-table.component.scss
│   │
│   └── exercise-dialog/
│       ├── exercise-dialog.component.ts
│       ├── exercise-dialog.component.html
│       └── exercise-dialog.component.scss
│
├── types/                          # Interfaces y tipos
│   ├── exercise.interface.ts
│   ├── muscle-group.enum.ts
│   └── exercise-type.enum.ts
│
└── services/                       # Servicios de la feature
    └── exercise-storage.service.ts
```

---

## 🎯 Tipos de Datos

> **📝 Nota sobre nomenclatura**: Usamos `types/` en lugar de `models/` porque solo definimos **interfaces y enums** (estructura de datos pura), no clases con comportamiento. Si en el futuro necesitas añadir lógica de validación o métodos, entonces crea una carpeta `models/` con clases.

### **1. Exercise Interface** (`types/exercise.interface.ts`)

```typescript
export interface Exercise {
  id: string;                    // UUID generado
  name: string;                  // Nombre del ejercicio
  muscleGroup: MuscleGroup;      // Grupo muscular principal
  type: ExerciseType;            // Tipo de equipo
  createdAt: Date;               // Fecha de creación
  updatedAt: Date;               // Última modificación
}
```

### **2. MuscleGroup Enum** (`types/muscle-group.enum.ts`)

```typescript
export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  LEGS = 'Legs',
  SHOULDERS = 'Shoulders',
  ARMS = 'Arms',
  CORE = 'Core',
  FULL_BODY = 'Full Body'
}
```

### **3. ExerciseType Enum** (`types/exercise-type.enum.ts`)

```typescript
export enum ExerciseType {
  BARBELL = 'Barbell',
  DUMBBELL = 'Dumbbell',
  BODYWEIGHT = 'Bodyweight',
  CABLE = 'Cable',
  MACHINE = 'Machine',
  TREADMILL = 'Treadmill',
  OTHER = 'Other'
}
```

### **4. Filter State Interface**

```typescript
export interface ExerciseFilters {
  searchText: string;
  muscleGroup: MuscleGroup | 'all';
}
```

---

## 🔧 Servicios

### **ExerciseStorageService** (`services/exercise-storage.service.ts`)

**Responsabilidades**:
- Persistencia en `localStorage`
- CRUD operations
- Generación de IDs únicos
- Validación de datos

**API Pública**:

```typescript
@Injectable({ providedIn: 'root' })
export class ExerciseStorageService {
  private readonly STORAGE_KEY = 'liftmate_exercises';

  // READ
  getAll(): Exercise[]
  getById(id: string): Exercise | undefined

  // CREATE
  create(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Exercise

  // UPDATE
  update(id: string, updates: Partial<Exercise>): Exercise | null

  // DELETE
  delete(id: string): boolean

  // UTILITIES
  private generateId(): string
  private saveToStorage(exercises: Exercise[]): void
  private loadFromStorage(): Exercise[]
}
```

**Consideraciones**:
- Usar `crypto.randomUUID()` para IDs
- Serializar/deserializar fechas correctamente
- Manejar errores de `localStorage` (cuota excedida, permisos)
- Validar datos antes de guardar

---

## 🧩 Componentes Presentacionales

### **1. ExerciseHeaderComponent**

**Propósito**: Mostrar título, subtítulo y botón de añadir ejercicio

**Inputs**:
```typescript
@Input() title: string = 'Exercises';
@Input() subtitle: string = 'Manage your exercise library';
@Input() exerciseCount: number = 0;
```

**Outputs**:
```typescript
@Output() addExercise = new EventEmitter<void>();
```

**Template**:
```html
<div class="exercise-header">
  <div class="exercise-header__info">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </div>
  <button mat-raised-button color="primary" (click)="addExercise.emit()">
    <mat-icon>add</mat-icon>
    Add Exercise
  </button>
</div>
```

---

### **2. ExerciseFiltersComponent**

**Propósito**: Barra de búsqueda y filtro por grupo muscular

**Inputs**:
```typescript
@Input() muscleGroups: MuscleGroup[] = Object.values(MuscleGroup);
@Input() currentFilters: ExerciseFilters;
```

**Outputs**:
```typescript
@Output() filtersChange = new EventEmitter<ExerciseFilters>();
```

**Features**:
- `mat-form-field` con `mat-autocomplete` para búsqueda de texto
- `mat-select` para filtro de grupo muscular
- Emitir cambios en tiempo real (debounce en búsqueda: 300ms)

**Template Structure**:
```html
<div class="exercise-filters">
  <!-- Search Input con Autocomplete -->
  <mat-form-field appearance="outline">
    <mat-icon matPrefix>search</mat-icon>
    <input matInput 
           placeholder="Search exercises..." 
           [formControl]="searchControl"
           [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete">
      <!-- Opciones dinámicas basadas en ejercicios existentes -->
    </mat-autocomplete>
  </mat-form-field>

  <!-- Muscle Group Select -->
  <mat-form-field appearance="outline">
    <mat-select [formControl]="muscleGroupControl">
      <mat-option value="all">All Muscle Groups</mat-option>
      <mat-option *ngFor="let group of muscleGroups" [value]="group">
        {{ group }}
      </mat-option>
    </mat-select>
  </mat-form-field>
</div>
```

**Lógica de Filtrado**:
```typescript
// Combinar ambos FormControls y emitir cambios
combineLatest([
  this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
  this.muscleGroupControl.valueChanges.pipe(startWith('all'))
]).subscribe(([searchText, muscleGroup]) => {
  this.filtersChange.emit({ searchText, muscleGroup });
});
```

---

### **3. ExerciseTableComponent**

**Propósito**: Tabla con ejercicios filtrados, chips de grupo muscular y acciones

**Inputs**:
```typescript
@Input() exercises: Exercise[] = [];
@Input() isLoading: boolean = false;
```

**Outputs**:
```typescript
@Output() deleteExercise = new EventEmitter<string>(); // Emite ID
```

**Features**:
- `MatTableDataSource` con filtrado programático
- Columnas: `name`, `muscleGroup`, `type`, `actions`
- Chips de colores para `muscleGroup` (usar `mat-chip`)
- Botón de eliminar con confirmación
- Responsive: ocultar columna `type` en móvil

**Template Structure**:
```html
<div class="exercise-table">
  <h2>Exercise Library ({{ exercises.length }})</h2>
  
  <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Exercise Name</th>
      <td mat-cell *matCellDef="let exercise">{{ exercise.name }}</td>
    </ng-container>

    <!-- Muscle Group Column -->
    <ng-container matColumnDef="muscleGroup">
      <th mat-header-cell *matHeaderCellDef>Muscle Group</th>
      <td mat-cell *matCellDef="let exercise">
        <mat-chip [style.background-color]="getChipColor(exercise.muscleGroup)">
          {{ exercise.muscleGroup }}
        </mat-chip>
      </td>
    </ng-container>

    <!-- Type Column -->
    <ng-container matColumnDef="type">
      <th mat-header-cell *matHeaderCellDef>Type</th>
      <td mat-cell *matCellDef="let exercise">{{ exercise.type }}</td>
    </ng-container>

    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let exercise">
        <button mat-icon-button (click)="onDelete(exercise.id)">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
```

**Filtrado Programático**:
```typescript
@Input() set filters(value: ExerciseFilters) {
  this.applyFilters(value);
}

private applyFilters(filters: ExerciseFilters): void {
  this.dataSource.filterPredicate = (exercise: Exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(filters.searchText.toLowerCase());
    
    const matchesMuscleGroup = 
      filters.muscleGroup === 'all' || 
      exercise.muscleGroup === filters.muscleGroup;
    
    return matchesSearch && matchesMuscleGroup;
  };
  
  // Trigger filter
  this.dataSource.filter = JSON.stringify(filters);
}
```

**Colores de Chips**:
```typescript
getChipColor(muscleGroup: MuscleGroup): string {
  const colorMap = {
    [MuscleGroup.CHEST]: 'var(--chip-chest)',
    [MuscleGroup.BACK]: 'var(--chip-back)',
    [MuscleGroup.LEGS]: 'var(--chip-legs)',
    [MuscleGroup.SHOULDERS]: 'var(--chip-shoulders)',
    [MuscleGroup.ARMS]: 'var(--chip-arms)',
    [MuscleGroup.CORE]: 'var(--chip-core)',
    [MuscleGroup.FULL_BODY]: 'var(--chip-full-body)'
  };
  return colorMap[muscleGroup] || 'var(--chip-full-body)';
}
```

> **💡 Nota**: Los colores están definidos como tokens semánticos en `styles.scss` (`--chip-chest`, `--chip-back`, etc.) para mantener consistencia con el design system y facilitar el theming.

---

### **4. ExerciseDialogComponent**

**Propósito**: Diálogo modal para crear/editar ejercicios

**Inputs** (via `MAT_DIALOG_DATA`):
```typescript
export interface ExerciseDialogData {
  exercise?: Exercise;  // Undefined = crear, definido = editar
  muscleGroups: MuscleGroup[];
  exerciseTypes: ExerciseType[];
}
```

**Outputs** (via `MatDialogRef`):
```typescript
// Cierra con el ejercicio creado/editado o null si se cancela
dialogRef.close(exercise: Exercise | null);
```

**Template Structure**:
```html
<h2 mat-dialog-title>
  {{ data.exercise ? 'Edit Exercise' : 'Add New Exercise' }}
</h2>

<mat-dialog-content>
  <form [formGroup]="exerciseForm">
    <!-- Exercise Name -->
    <mat-form-field appearance="outline">
      <mat-label>Exercise Name</mat-label>
      <input matInput formControlName="name" required>
      <mat-error *ngIf="exerciseForm.get('name')?.hasError('required')">
        Name is required
      </mat-error>
    </mat-form-field>

    <!-- Muscle Group Select -->
    <mat-form-field appearance="outline">
      <mat-label>Muscle Group</mat-label>
      <mat-select formControlName="muscleGroup" required>
        <mat-option *ngFor="let group of data.muscleGroups" [value]="group">
          {{ group }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <!-- Exercise Type Select -->
    <mat-form-field appearance="outline">
      <mat-label>Exercise Type</mat-label>
      <mat-select formControlName="type" required>
        <mat-option *ngFor="let type of data.exerciseTypes" [value]="type">
          {{ type }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onCancel()">Cancel</button>
  <button mat-raised-button 
          color="primary" 
          (click)="onSave()"
          [disabled]="exerciseForm.invalid">
    {{ data.exercise ? 'Update' : 'Create' }}
  </button>
</mat-dialog-actions>
```

**Form Logic**:
```typescript
export class ExerciseDialogComponent implements OnInit {
  exerciseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExerciseDialogData
  ) {}

  ngOnInit(): void {
    this.exerciseForm = this.fb.group({
      name: [this.data.exercise?.name || '', Validators.required],
      muscleGroup: [this.data.exercise?.muscleGroup || '', Validators.required],
      type: [this.data.exercise?.type || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.exerciseForm.valid) {
      this.dialogRef.close(this.exerciseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
```

---

## 🎛️ Container Component Logic

### **ExercisesComponent** (`exercises.component.ts`)

**Responsabilidades**:
1. Gestionar estado de ejercicios
2. Manejar filtros
3. Abrir diálogo de creación/edición
4. Delegar operaciones CRUD al servicio
5. Componer componentes presentacionales

**State Management**:
```typescript
export class ExercisesComponent implements OnInit {
  // State
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  currentFilters: ExerciseFilters = {
    searchText: '',
    muscleGroup: 'all'
  };
  
  // Enums para pasar a componentes hijos
  muscleGroups = Object.values(MuscleGroup);
  exerciseTypes = Object.values(ExerciseType);

  constructor(
    private exerciseStorage: ExerciseStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  // CRUD Operations
  loadExercises(): void {
    this.exercises = this.exerciseStorage.getAll();
    this.applyFilters();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ExerciseDialogComponent, {
      width: '500px',
      data: {
        muscleGroups: this.muscleGroups,
        exerciseTypes: this.exerciseTypes
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseStorage.create(result);
        this.loadExercises();
      }
    });
  }

  deleteExercise(id: string): void {
    // Mostrar confirmación
    const confirmed = confirm('Are you sure you want to delete this exercise?');
    if (confirmed) {
      this.exerciseStorage.delete(id);
      this.loadExercises();
    }
  }

  // Filtering
  onFiltersChange(filters: ExerciseFilters): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredExercises = this.exercises.filter(exercise => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(this.currentFilters.searchText.toLowerCase());
      
      const matchesMuscleGroup = 
        this.currentFilters.muscleGroup === 'all' || 
        exercise.muscleGroup === this.currentFilters.muscleGroup;
      
      return matchesSearch && matchesMuscleGroup;
    });
  }
}
```

**Template** (`exercises.component.html`):
```html
<div class="exercises-container">
  <!-- Header -->
  <app-exercise-header
    [exerciseCount]="exercises.length"
    (addExercise)="openAddDialog()">
  </app-exercise-header>

  <!-- Filters -->
  <app-exercise-filters
    [muscleGroups]="muscleGroups"
    [currentFilters]="currentFilters"
    (filtersChange)="onFiltersChange($event)">
  </app-exercise-filters>

  <!-- Table -->
  <app-exercise-table
    [exercises]="filteredExercises"
    [filters]="currentFilters"
    (deleteExercise)="deleteExercise($event)">
  </app-exercise-table>
</div>
```

---

## 🎨 Estilos y Diseño

### **Consideraciones de Diseño**

1. **Mobile-First**: Diseñar para móvil primero
2. **Responsive Table**: 
   - En móvil: Ocultar columna `type`, usar cards en lugar de tabla
   - En tablet/desktop: Tabla completa
3. **Spacing**: Usar variables CSS del design system
4. **Colores de Chips**: Consistentes con la paleta de colores
5. **Elevación**: Cards con `mat-elevation-z2`

### **Layout del Container**:
```scss
.exercises-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
}
```

---

## 🧪 Testing Strategy

### **Unit Tests**

**Services**:
- `ExerciseStorageService`: Mockear `localStorage`
- Verificar CRUD operations
- Validar generación de IDs únicos

**Presentational Components**:
- Verificar `@Input()` rendering
- Verificar `@Output()` emissions
- Snapshot testing para UI

**Container Component**:
- Mockear `ExerciseStorageService` y `MatDialog`
- Verificar flujo de datos
- Verificar llamadas a servicios

---

## 📦 Módulos de Angular Material Necesarios

```typescript
// En exercises.component.ts imports:
[
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTableModule,
  MatChipsModule,
  MatDialogModule,
  ReactiveFormsModule,
  CommonModule
]
```

---

## 🚀 Plan de Implementación (Orden Sugerido)

### **Fase 1: Fundamentos**
1. Crear tipos (`exercise.interface.ts`, enums en `types/`)
2. Implementar `ExerciseStorageService`
3. Escribir tests para el servicio

### **Fase 2: Componentes Presentacionales**
4. `ExerciseHeaderComponent` (más simple)
5. `ExerciseFiltersComponent`
6. `ExerciseTableComponent`
7. `ExerciseDialogComponent`

### **Fase 3: Integración**
8. Implementar lógica del `ExercisesComponent` (container)
9. Conectar todos los componentes
10. Añadir datos de ejemplo en `localStorage`

### **Fase 4: Refinamiento**
11. Estilos responsive
12. Animaciones (opcional)
13. Confirmación de eliminación con `MatDialog` en lugar de `confirm()`
14. Testing end-to-end

---

## 💡 Mejoras Futuras (Post-MVP)

1. **Edición de Ejercicios**: Reutilizar `ExerciseDialogComponent`
2. **Ordenamiento**: Añadir `matSort` a la tabla
3. **Paginación**: `MatPaginator` para listas largas
4. **Exportar/Importar**: JSON export/import de ejercicios
5. **Imágenes**: Añadir campo de imagen/GIF del ejercicio
6. **Categorías Personalizadas**: Permitir crear grupos musculares custom
7. **Búsqueda Avanzada**: Filtro por múltiples criterios
8. **Drag & Drop**: Reordenar ejercicios
9. **Backend Integration**: Migrar de `localStorage` a API REST

---

## ⚠️ Consideraciones Importantes

### **localStorage Limitations**
- **Cuota**: ~5-10MB según navegador
- **Sincronización**: No sincroniza entre dispositivos
- **Seguridad**: Datos en texto plano
- **Solución temporal**: Migrar a IndexedDB o backend cuando escale

### **Validaciones**
- Nombres de ejercicios únicos
- Sanitización de inputs
- Manejo de errores de `localStorage` lleno

### **UX**
- Loading states durante operaciones
- Empty states cuando no hay ejercicios
- Mensajes de confirmación tras acciones
- Feedback visual (snackbars) para CRUD operations

---

## 📚 Recursos de Referencia

- [Angular Material Table](https://material.angular.io/components/table/overview)
- [Angular Material Dialog](https://material.angular.io/components/dialog/overview)
- [Angular Material Autocomplete](https://material.angular.io/components/autocomplete/overview)
- [Container/Presentational Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## ✅ Checklist de Implementación

- [ ] Crear interfaces y enums en `types/`
- [ ] Implementar `ExerciseStorageService`
- [ ] Crear `ExerciseHeaderComponent`
- [ ] Crear `ExerciseFiltersComponent` con autocomplete
- [ ] Crear `ExerciseTableComponent` con filtrado
- [ ] Crear `ExerciseDialogComponent` con formulario reactivo
- [ ] Implementar lógica del container `ExercisesComponent`
- [ ] Conectar todos los componentes en el template
- [ ] Añadir estilos responsive
- [ ] Poblar con datos de ejemplo
- [ ] Testing de componentes
- [ ] Refinamiento de UX/UI

---

**¡Buena suerte con la implementación!** 🎯

Esta estrategia te proporciona una base sólida y escalable. Recuerda seguir el principio de **separación de responsabilidades** y mantener los componentes presentacionales lo más puros posible.
