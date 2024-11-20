import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Potion } from '../model/potion.model';

@Injectable({
  providedIn: 'root'
})
export class PotionService {

  private apiUrl = environment.apiUrl + '/potion';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Potion[]> {
    return this.httpClient.get<Potion[]>(`${this.apiUrl}/`).pipe(
      tap((potion) => {
        console.log(`Potions retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Potions not found.'));
        } else {
          return throwError(() => new Error('Error retrieving Potions. Please try again later.'));
        }
      })
    );
  }
}
