# Guía de Testing en Angular (para Desarrolladores de React)

Si vienes de React con Jest y React Testing Library (RTL), notarás que Angular tiene una arquitectura más "ceremonial" pero muy potente gracias a su Inyección de Dependencias.

En Angular, el estándar es usar **Jasmine** (aserciones y mocks) y **Karma** (runner), aunque la lógica de `TestBed` es universal.

---

## 1. El Patrón AAA (Arrange, Act, Assert)

Este patrón es universal. En Angular se ve así:

```typescript
it('debería sumar dos números', () => {
  // Arrange (Preparar)
  const a = 2;
  const b = 3;

  // Act (Actuar)
  const result = mathUtils.add(a, b);

  // Assert (Afirmar/Verificar)
  expect(result).toBe(5);
});
```

---

## 2. Testing de Utilidades (Pure Functions)

Es lo más sencillo y parecido a React. No necesitas `TestBed`.

```typescript
// no-numbers.validator.spec.ts
import { noNumbersValidator } from './form.utils';
import { FormControl } from '@angular/forms';

describe('noNumbersValidator', () => {
  it('debería retornar error si el valor contiene números', () => {
    const control = new FormControl('Bench Press 101');
    const result = noNumbersValidator(control);
    expect(result).toEqual({ noNumbers: true });
  });

  it('debería retornar null si el valor es válido', () => {
    const control = new FormControl('Bench Press');
    expect(noNumbersValidator(control)).toBeNull();
  });
});
```

---

## 3. Testing de Servicios (Mocks y Di)

Aquí es donde Angular brilla. Usamos `TestBed` para configurar el módulo de pruebas e inyectar dependencias.

> [!TIP]
> **Mocking**: En lugar de usar el servicio real (que podría tocar localStorage o APIs), creamos un "espía" o una clase mock.

```typescript
// storage.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService] // Aquí podrías mockear el PLATFORM_ID si fuera necesario
    });
    service = TestBed.inject(StorageService);
    
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  it('debería guardar y recuperar datos', () => {
    const key = 'test';
    const data = { id: '1', name: 'Test' };
    
    service.save(key, data);
    
    service.watch$(key).subscribe(items => {
      expect(items).toContain(jasmine.objectContaining(data));
    });
  });
});
```

---

## 4. Testing de Componentes (Integración)

En Angular probamos la clase `.ts` y el template `.html` juntos.

### Conceptos Clave:
- **`TestBed`**: Configura el componente y sus dependencias (imports, providers).
- **`ComponentFixture`**: Es el "wrapper" del componente. Da acceso a la instancia y al DOM.
- **`debugElement`**: Forma de Angular de buscar elementos en el DOM (como `screen` en RTL).

```typescript
// exercise-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '@shared/services/storage/storage.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    // 1. Crear mocks de las dependencias
    const spy = jasmine.createSpyObj('StorageService', ['save', 'update']);

    await TestBed.configureTestingModule({
      imports: [
        ExerciseFormComponent, 
        NoopAnimationsModule // Evita errores de animaciones de Material
      ],
      providers: [
        { provide: StorageService, useValue: spy },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: null } // Modo creación por defecto
      ]
    }).compileComponents();

    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger inicial de ciclo de vida (ngOnInit, etc.)
  });

  it('debería mostrar error si el nombre está vacío', () => {
    const nameControl = component.exerciseForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    
    fixture.detectChanges(); // Renderizar cambios en el HTML

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain('Name is required');
  });

  it('debería llamar a storage.save al enviar un formulario válido', () => {
    // Arrange
    component.exerciseForm.patchValue({
      name: 'Bench Press',
      type: 'Strength',
      muscleGroup: 'Chest'
    });

    // Act
    component.handleSaveForm();

    // Assert
    expect(storageServiceSpy.save).toHaveBeenCalled();
  });
});
```

---

## 5. Testing de Signals

Los Signals son reactivos por naturaleza. Para testear un `computed`, simplemente cambia el valor del signal de origen.

```typescript
it('debería cambiar el título según el modo', () => {
  // Por defecto es creación
  expect(component.title()).toBe('Add Exercise');

  // Cambiamos el modo (suponiendo que isEditMode es un writable signal para el test)
  component.isEditMode.set(true);
  
  // El computed se actualiza automáticamente
  expect(component.title()).toBe('Edit Exercise');
});
```

---

## Diferencias Técnicas (React vs Angular)

| Concepto | React (RTL/Jest) | Angular (TestBed/Jasmine) |
| :--- | :--- | :--- |
| **Setup** | `render(<Component />)` | `TestBed.configureTestingModule(...)` |
| **DOM** | `screen.getByText(...)` | `fixture.nativeElement.querySelector(...)` o `debugElement.query(...)` |
| **Mocks** | `jest.mock(...)` | `jasmine.createSpyObj(...)` o `useValue` en providers |
| **Cambios** | Automático / `waitFor` | `fixture.detectChanges()` (Manual) |
| **Async** | `async/await` | `fakeAsync` + `tick()` o `waitForAsync` |

---

> [!IMPORTANT]
> **No olvides `fixture.detectChanges()`**: A diferencia de React, en los tests de Angular los cambios en el estado del componente NO se reflejan en el HTML automáticamente. Debes llamar a este método cada vez que quieras verificar algo en el DOM después de una acción.
