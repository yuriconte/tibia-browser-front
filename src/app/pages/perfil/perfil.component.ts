import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Character } from 'src/app/model/character.model';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [`
    .character-info {
      max-width: 800px;
      margin: auto;
      font-family: 'Verdana', sans-serif;
      font-size: 14px;
    }

    ::ng-deep .health-bar .p-progressbar .p-progressbar-value {
      background-color: #f87171; /* Vermelho para saúde */
    }

    ::ng-deep .mana-bar .p-progressbar .p-progressbar-value {
      background-color: #7dd3fc; /* Azul para mana */
    }

    :host ::ng-deep .custom-button {
        padding: 0.5rem 1.5rem !important;
    }
  `],
  providers: [ConfirmationService, MessageService]
})
export class PerfilComponent {

  character: Character = new Character;
  items: MenuItem[] = [];

  characterName = 'Knight of Rookgaard';
  bankBalance = 250;

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.items = [
        { label: 'Equipar', icon: 'pi pi-check-circle' },
        { separator: true },
        { label: 'Desequipar', icon: 'pi pi-ban' }
    ];
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

  confirmVocation(event: Event, vocation:number) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: 'Tem certeza que deseja se tornar um ' + (vocation === 2 ? 'Knight' : vocation === 3 ? 'Paladin' : vocation === 4 ? 'Druid' : 'Sorcerer') + '?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            this.service.add({ key: 'tst', severity: 'info', summary: 'Parabéns', detail: 'Agora você é um ' + (vocation === 2 ? 'Knight' : vocation === 3 ? 'Paladin' : vocation === 4 ? 'Druid' : 'Sorcerer') });
        },
    });
  }
}
