import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { CharacterDeath } from '../model/character-death.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterDeathService {

  private apiUrl = environment.apiUrl + '/character-death';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<CharacterDeath[]> {
    return this.httpClient.get<CharacterDeath[]>(`${this.apiUrl}/`).pipe(
      tap((characters) => {
        console.log(`Characters retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Character not found.'));
        } else {
          return throwError(() => new Error('Error retrieving character. Please try again later.'));
        }
      })
    );
  }

}
