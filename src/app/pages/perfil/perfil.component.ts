import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Character } from 'src/app/model/character.model';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Item } from 'src/app/model/item.model';
import { CharacterPotion } from 'src/app/model/character-potion.model';

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

    .font-tibia {
      font-family: var(--font-family-tibia);
    }

    .name-character {
      text-align: center;
      font-size: 30px;
    }

    .sex-character {
      text-align: left;
      font-size: 20px;
    }

    .coin {
      text-align: left;
      font-size: 16px;
    }

    .vocation-character {
      text-align: left;
      font-size: 30px;
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

    ::ng-deep .p-badge.p-badge-xl {
      font-size: 1.5rem;
      min-width: 6rem;
      height: 3rem;
      line-height: 3rem;
      color: white;
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
  
  showItemDetailSelected: Item;
  showItemDetail: boolean = false;

  loading: boolean = false;

  lifeInterval;
  manaInterval;

  expNextLevel:number = 0;
  expPreviousLevel:number = 0;

  labelPromotion:string = "";

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.loadCharacter();
  }

  ngOnDestroy() {
    if (this.lifeInterval) {
      clearInterval(this.lifeInterval);
    }
    if (this.manaInterval) {
      clearInterval(this.manaInterval);
    }
  }

  getCoins(balance: number): { crystal: number; platinum: number; gold: number } {
    const crystal = Math.floor(balance / 10000); // 1 Cristal = 10.000
    const remainderAfterCrystal = balance % 10000;
  
    const platinum = Math.floor(remainderAfterCrystal / 100); // 1 Platina = 100
    const gold = remainderAfterCrystal % 100; // Restante são ouros
  
    return { crystal, platinum, gold };
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
            if (this.character.level >= 20 && this.character.vocationId > 1 && this.character.vocationId < 6) {
              this.labelPromotion = this.character.vocationId == 2 ? 'Elike Knight' : this.character.vocationId == 3 ? 'Royal Paladin' : this.character.vocationId == 4 ? 'Elder Druid' : 'Master Sorcerer'
            }
            this.loading = false
            this.lifeInterval = setInterval(() => {
              if (this.character.life < this.character.maxLife) {
                this.character.life += 1
              }
            },1000);
            this.manaInterval = setInterval(() => {
              if (this.character.mana < this.character.maxMana) {
                this.character.mana += 1
              }
            },1000);
            this.expNextLevel = this.calculateExpLevelFormula(this.character.level)
            this.expPreviousLevel = this.calculateExpLevelFormula(this.character.level-1)
        },
        error: () => {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
        }
      });
    } else {
      this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
    }
  }

  calculateExpLevelFormula(x: number): number {
    x += 1;
    return (50 * Math.pow(x - 1, 3) - 150 * Math.pow(x - 1, 2) + 400 * (x - 1)) / 3;
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
      case 7:
        if (this.character.slotAmmo) {
          this.deequip({...this.character.slotAmmo}, false)
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

  usePotion(potion: CharacterPotion) {
    if (potion.potion.type === 'life') {
      if (this.character.life == this.character.maxLife) {
        this.service.add({ key: 'tst', severity: 'warning', summary: 'Atenção', detail: 'Sua vida está cheia. Não é possível usar potion agora.' });
        return;
      }
      potion.quantity -= 1;
      let healQuantity = Math.round(this.getRandomInRange(potion.potion.min, potion.potion.max))
      if (this.character.life + healQuantity <= this.character.maxLife) {
        this.character.life += healQuantity;
      } else {
        this.character.life = this.character.maxLife
      }
      this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, potion.potion.id, null);
    } else if (potion.potion.type === 'mana') {
      if (this.character.mana == this.character.maxMana) {
        this.service.add({ key: 'tst', severity: 'warning', summary: 'Atenção', detail: 'Sua mana está cheia. Não é possível usar potion agora.' });
        return;
      }
      potion.quantity -= 1;
      let healQuantity = Math.round(this.getRandomInRange(potion.potion.min, potion.potion.max))
      if (this.character.mana + healQuantity <= this.character.maxMana) {
        this.character.mana += healQuantity;
      } else {
        this.character.mana = this.character.maxMana
      }
      this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, potion.potion.id);
    }
  }

  getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  sellAllItems() {
    this.characterService.sellAllItems(this.character.id);
    this.character.items = []
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: 'Todos os items foram vendidos com sucesso.' });
    setTimeout(() => {
      window.location.reload();
    }, 3000)
  }

  confirmPromotion(event: Event) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: 'Tem certeza que deseja se tornar um ' + this.labelPromotion + ' ao custo de 20k?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
          this.character.vocationId = this.character.vocationId == 2 ? 6 : this.character.vocationId == 3 ? 7 : this.character.vocationId == 4 ? 8 : 9;
          this.character.balance -= 20000
          this.characterService.updateVocation(this.character.id, this.character.vocationId);
          this.service.add({ key: 'tst', severity: 'info', summary: 'Parabéns', detail: 'Agora você é um ' + this.labelPromotion });
        },
    });
  }
}
