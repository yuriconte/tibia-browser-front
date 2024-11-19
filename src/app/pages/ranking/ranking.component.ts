import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styles: [`
    .image-container {
      position: relative;
      display: inline-block;
    }

    .image-container img {
      display: block;
    }

    .p-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  `],
  providers: [MessageService]
})
export class RankingComponent {
 
  characters: Character[] = [];

  constructor(private characterService: CharacterService,
    private service: MessageService) {}

  ngOnInit() {
    this.loadAllCharacter();
  }

  loadAllCharacter() {
    this.characterService.getAll().subscribe({
      next: (data) => {
          this.characters = data;
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter ranking." });
      }
    });
  }
 
}
