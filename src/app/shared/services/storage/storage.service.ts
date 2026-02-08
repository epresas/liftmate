import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Identifiable } from './storage.service.types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  // Map to store the different data collections, like a central store
  private storedSubjects = new Map<string, BehaviorSubject<any[]>>();

  // Observable to watch for changes in the data
  watch$<T>(key: string, defaultValue: T[] = []): Observable<T[]> {
    if (!this.storedSubjects.has(key)) {
      const storedData = this.readFromLocalStorage<T>(key);
      const initialValue = storedData !== null ? storedData : defaultValue;

      this.storedSubjects.set(key, new BehaviorSubject<T[]>(initialValue));
    }
    return this.storedSubjects.get(key)!.asObservable();
  }

  save<T>(key: string, newItem: T) {
    const currentSubject = this.storedSubjects.get(key);
    const currentItems = currentSubject ? currentSubject.value : this.readFromLocalStorage<T>(key) || [];
    const itemWithId = {
      ...newItem,
      id: (newItem as any).id || crypto.randomUUID()
    };

    const updatedItems = [...currentItems, itemWithId];
    this.writeToLocalStorage(key, updatedItems);
    this.storedSubjects.get(key)?.next(updatedItems);
  }

  update<T extends Identifiable>(key: string, updatedItem: T) {
    const currentSubject = this.storedSubjects.get(key);
    const currentItems = currentSubject ? currentSubject.value : this.readFromLocalStorage<T>(key) || [];
    const updatedItems = currentItems.map(item => item.id === updatedItem.id ? updatedItem : item);

    this.writeToLocalStorage(key, updatedItems);
    this.storedSubjects.get(key)?.next(updatedItems)
  }

  delete<T extends Identifiable>(key: string, id: string) {
    const currentSubject = this.storedSubjects.get(key);
    const currentItems = currentSubject ? currentSubject.value : this.readFromLocalStorage<T>(key) || [];
    const updatedItems = currentItems.filter(item => item.id !== id);

    this.writeToLocalStorage(key, updatedItems);
    this.storedSubjects.get(key)?.next(updatedItems);
  }

  //  Local Storage Interaction

  readFromLocalStorage<T>(key: string): T[] | null {
    if (!this.isBrowser) return null;
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) as T[] : null;
  }

  writeToLocalStorage(key: string, value: unknown[]) {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

}
