import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should save data and get data successfully', () => {
    const exercise = {
      id: '1',
      name: 'test exercise',
      type: 'barbell',
      muscleGorup: 'chest',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    service.save('test', exercise);
    const result = service.readFromLocalStorage<any>('test');
    expect(result).toEqual([
      {
        ...exercise,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString()
      }
    ]);
    service.watch$('test').subscribe(items => {
      expect(items).toContain(jasmine.objectContaining({
        ...exercise,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString()
      }))
    })
  });
  it('should update data successfully', () => {
    const exercise = {
      id: '1',
      name: 'test exercise',
      type: 'barbell',
      muscleGorup: 'chest',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    service.save('test', exercise);
    const result = service.readFromLocalStorage<any>('test');
    expect(result).toEqual([
      {
        ...exercise,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString()
      }
    ]);
  });
  it('should delete data successfully', () => {
    const exercise = {
      id: '1',
      name: 'test exercise',
      type: 'barbell',
      muscleGorup: 'chest',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    service.save('test', exercise);
    const result = service.readFromLocalStorage<any>('test');
    expect(result).toEqual([
      {
        ...exercise,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString()
      }
    ]);
  });
});
