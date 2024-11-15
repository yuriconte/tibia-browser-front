import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Bestiary } from '../model/bestiary.model';

@Injectable({
  providedIn: 'root'
})
export class BestiaryService {

  private apiUrl = environment.apiUrl + '/bestiary';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Bestiary[]> {
    return this.httpClient.get<Bestiary[]>(`${this.apiUrl}/`).pipe(
      tap((bestiary) => {
        console.log(`Bestiary retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Bestiary not found.'));
        } else {
          return throwError(() => new Error('Error retrieving bestiary. Please try again later.'));
        }
      })
    );
  }
}
