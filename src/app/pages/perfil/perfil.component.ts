import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Character } from 'src/app/model/character.model';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Item } from 'src/app/model/item.model';

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
      background-color: #38bdf8; /* Azul para mana */
    }

    ::ng-deep .exp-bar .p-progressbar .p-progressbar-value {
      background-color: #a855f7; 
    }

    :host ::ng-deep .custom-button {
        padding: 0.5rem 1.5rem !important;
        height: 50px;
    }

    .progress-container {
      position: relative;
      width: 100%;
    }

    /* Estilos para o texto fixo */
    .progress-text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      color: white;
      font-weight: bold;
      justify-content: center;
      align-items: center;
      pointer-events: none; /* Garante que o texto não interfira na interação com a barra */
    }
  `],
  providers: [ConfirmationService, MessageService]
})
export class PerfilComponent {

  character: Character = new Character;
  items: MenuItem[] = [];

  characterName = 'Knight of Rookgaard';
  
  showItemDetailSelected: Item;
  showItemDetail: boolean = false;

  loading: boolean = false;

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.loadCharacter();
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
            this.loading = false
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
          this.characterService.updateVocation(this.character.id, vocation);
          this.character.vocationId = vocation;
          this.service.add({ key: 'tst', severity: 'info', summary: 'Parabéns', detail: 'Agora você é um ' + (vocation === 2 ? 'Knight' : vocation === 3 ? 'Paladin' : vocation === 4 ? 'Druid' : 'Sorcerer') });
        },
    });
  }

  confirmEquipedItem(event: Event, item:Item) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: 'O que deseja fazer?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Remover',
        rejectLabel: 'Detalhes',
        accept: () => {
          this.deequip(item, true)
        },
        reject: () => {
          this.showEquipDetail(item)
        }
    });
  }
   
  showEquipDetail(item: Item) {
    this.showItemDetailSelected = item
    this.showItemDetail = true;
  }
 
  equip(item: Item) {
    switch(item.slot) {
      case 1:
        if (this.character.slot1Item) {
          this.deequip({...this.character.slot1Item}, false)
        }
        break;
      case 2:
        if (this.character.slot2Item) {
          this.deequip({...this.character.slot2Item}, false)
        }
        break;
      case 3:
        if (this.character.slot3Item) {
          this.deequip({...this.character.slot3Item}, false)
        }
        break;
      case 4:
        if (this.character.slot4Item) {
          this.deequip({...this.character.slot4Item}, false)
        }
        break;
      case 5:
        if (this.character.slot5Item) {
          this.deequip({...this.character.slot5Item}, false)
        }
        break;
      case 6:
        if (this.character.slot6Item) {
          this.deequip({...this.character.slot6Item}, false)
        }
        break;
      default:
    }
    setTimeout(() => {
      this.characterService.equipItem(this.character.id, item.id);
      setTimeout(() => {
        window.location.reload();
      }, 500)
    }, 500)
  }

  deequip(item: Item, updateCharacter: boolean) {
    this.characterService.deEquipItem(this.character.id, item.slot);
    if (updateCharacter) {
      window.location.reload();
    }
  }

  sellItem(item: Item) {
    this.characterService.sellItem(this.character.id, item.id);
    this.character.balance += item.gold;
    const itemIndex = this.character.items.findIndex(i => i.item.id === item.id);
    if (itemIndex !== -1) {
      this.character.items[itemIndex].quantity -= 1;
      if (this.character.items[itemIndex].quantity === 0) {
          this.character.items.splice(itemIndex, 1);
      }
      this.service.add({ key: 'tst', severity: 'success', summary: 'Parabéns', detail: 'Item vendido com sucesso' });
    } else {
      this.service.add({ key: 'tst', severity: 'danger', summary: 'Erro', detail: 'Ocorreu um erro. Atualize a página e tente novamente.' });
    }
  }

  confirmUnequipedItem(event: Event, item:Item) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: 'O que deseja fazer?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Equipar',
        rejectLabel: 'Detalhes',
        accept: () => {
          this.equip(item)
        },
        reject: () => {
          this.showEquipDetail(item)
        }
    });
  }
}
