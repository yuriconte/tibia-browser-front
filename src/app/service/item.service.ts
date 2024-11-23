import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Potion } from '../model/potion.model';
import { Item } from '../model/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = environment.apiUrl + '/item';

  constructor(private httpClient: HttpClient) {}

  getWands(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${this.apiUrl}/wands`).pipe(
      tap((potion) => {
        console.log(`Wands retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Wands not found.'));
        } else {
          return throwError(() => new Error('Error retrieving wands. Please try again later.'));
        }
      })
    );
  }

  getRods(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${this.apiUrl}/rods`).pipe(
      tap((potion) => {
        console.log(`Rods retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Rods not found.'));
        } else {
          return throwError(() => new Error('Error retrieving Rods. Please try again later.'));
        }
      })
    );
  }
}
