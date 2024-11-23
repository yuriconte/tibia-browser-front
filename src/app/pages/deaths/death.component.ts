import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { Character } from 'src/app/model/character.model';
import { CharacterDeathService } from 'src/app/service/character-death.service';
import { CharacterDeath } from 'src/app/model/character-death.model';

@Component({
  selector: 'app-death',
  templateUrl: './death.component.html',
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
export class DeathComponent {
 
  characters: CharacterDeath[] = [];

  constructor(private characterDeathService: CharacterDeathService,
    private service: MessageService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.characterDeathService.getAll().subscribe({
      next: (data) => {
          this.characters = data;
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter ultimas mortes." });
      }
    });
  }
 
}
