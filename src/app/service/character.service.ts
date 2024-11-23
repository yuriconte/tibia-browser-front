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

  getAll(): Observable<Character[]> {
    return this.httpClient.get<Character[]>(`${this.apiUrl}/`).pipe(
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

  updateCharacter(characterId: number, bestiaryId: number, experience: number, life: number, mana: number, expHour: number, increaseBalance: number, itemLooted: number[]) {
    this.httpClient.post<void>(`${this.apiUrl}/updateCharacter`, { characterId, bestiaryId, experience, life, mana, expHour, increaseBalance, itemLooted }).subscribe({
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

  updateCharacterLifeManaStaminaByValues(characterId: number, life: number, mana: number, potionId: number, potionId2: number) {
    this.httpClient.post<void>(this.apiUrl + "/updateCharacterLifeManaStaminaByValues", { characterId, life, mana, potionId, potionId2 }).subscribe({
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

  sellItem(characterId: number, itemId) {
    this.httpClient.post<void>(this.apiUrl + "/sellItem", { characterId, itemId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  equipItem(characterId: number, itemId) {
    this.httpClient.post<void>(this.apiUrl + "/equipItem", { characterId, itemId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  deEquipItem(characterId: number, slotNumber) {
    this.httpClient.post<void>(this.apiUrl + "/deEquipItem", { characterId, slotNumber }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  updateVocation(characterId: number, vocationId: number) {
    this.httpClient.post<void>(this.apiUrl + "/updateVocation", { characterId, vocationId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  buyPotion(characterId: number, potionId: number, buyQuantity: number, cost: number) {
    this.httpClient.post<void>(this.apiUrl + "/buyPotion", { characterId, potionId, buyQuantity, cost }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  buyItem(characterId: number, itemId: number, cost: number) {
    this.httpClient.post<void>(this.apiUrl + "/buyItem", { characterId, itemId, cost }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  startHuntOffline(characterId: number, huntHours, bestiaryId) {
    this.httpClient.post<void>(this.apiUrl + "/startHuntOffline", { characterId, huntHours, bestiaryId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  cancelHuntOffline(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/cancelHuntOffline", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  characterDead(characterId: number, monsterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/characterDead", { characterId, monsterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }

  sellAllItems(characterId: number) {
    this.httpClient.post<void>(this.apiUrl + "/sellAllItems", { characterId }).subscribe({
      next: () => {
        console.log('Requisição enviada e recebida com sucesso');
      },
      error: (err) => {
        console.error('Erro ao enviar a requisição:', err);
      }
    })
  }
}
