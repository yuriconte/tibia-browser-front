import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';

@Component({
  selector: 'app-bestiary',
  templateUrl: './bestiary.component.html',
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
    
    ::ng-deep .p-button.p-button-text:focus,
    ::ng-deep .p-button.p-button-text.p-button-active {
      background-color: transparent !important; /* Remove o fundo */
      color: inherit !important; /* Mantém a cor do texto original */
      box-shadow: none !important; /* Remove bordas ou sombreamento */
    }

    ::ng-deep .p-button.p-button-text:focus {
      outline: none !important; /* Remove o contorno padrão */
      background-color: transparent !important; /* Remove o fundo */
    }
  `],
  providers: [MessageService]
})
export class BestiaryComponent {
 
  character: Character = new Character;

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
        },
        error: () => {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
        }
      });
    } else {
      this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
    }
  }
 
}
