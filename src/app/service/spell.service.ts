import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Spell } from '../model/spell.model';

@Injectable({
  providedIn: 'root'
})
export class SpellService {

  private apiUrl = environment.apiUrl + '/spell';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Spell[]> {
    return this.httpClient.get<Spell[]>(`${this.apiUrl}/`).pipe(
      tap((spell) => {
        console.log(`Spells retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Spells not found.'));
        } else {
          return throwError(() => new Error('Error retrieving Spells. Please try again later.'));
        }
      })
    );
  }
}
