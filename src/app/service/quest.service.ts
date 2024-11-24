import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Quest } from '../model/quest.model';

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  private apiUrl = environment.apiUrl + '/quest';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Quest[]> {
    return this.httpClient.get<Quest[]>(`${this.apiUrl}/`).pipe(
      tap((quest) => {
        console.log(`Quests retrieved successfully`);
      }),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Quests not found.'));
        } else {
          return throwError(() => new Error('Error retrieving Quests. Please try again later.'));
        }
      })
    );
  }
}
