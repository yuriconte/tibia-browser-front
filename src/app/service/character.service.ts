import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../app.constants';
import { Character } from '../model/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private apiUrl = environment.apiUrl + '/character';

  constructor(private httpClient: HttpClient) {}

  getCharacter(name: string): Observable<Character> {
    return this.httpClient.get<Character>(`${this.apiUrl}/${name}`).pipe(
      tap((character) => {
        console.log(`Character ${character.name} retrieved successfully`);
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

  updateCharacter(characterId: number, bestiaryId: number, experience: number, life: number, mana: number, expHour: number, increaseBalance: number) {
    this.httpClient.post<void>(`${this.apiUrl}/updateCharacter`, { characterId, bestiaryId, experience, life, mana, expHour, increaseBalance }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  updateCharacterLifeManaStamina(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/updateCharacterLifeManaStamina", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseLevel(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseLevel", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startSword(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startSword", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startAxe(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startAxe", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startClub(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startClub", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startDistance(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startDistance", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startShielding(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startShielding", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startMagicLevel(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/startMagicLevel", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseSword(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseSword", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseAxe(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseAxe", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseClub(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseClub", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseDistance(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseDistance", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseShielding(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseShielding", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  increaseMagicLevel(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/increaseMagicLevel", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  cancelSkill(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/cancelSkill", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }
}