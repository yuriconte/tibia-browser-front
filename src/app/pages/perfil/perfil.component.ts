import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Character } from 'src/app/model/character.model';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Item } from 'src/app/model/item.model';
import { CharacterPotion } from 'src/app/model/character-potion.model';
import { Potion } from 'src/app/model/potion.model';
import { BehaviorSubject } from 'rxjs';

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

    ::ng-deep .p-badge {
      color: white;
      font-weight: 100;
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
      font-size: 28px;
    }

    .money-character {
      font-size: 17px;
      align-content: center;
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

    ::ng-deep .equip .p-card .p-card-body .p-card-content {
      padding: 0;
      height: 40px;
      text-align: center;
    }

    ::ng-deep .equip .p-card {
      background: #283443;
      transition: background 1s ease-in-out; /* Define a transição */
    }

    ::ng-deep .p-card .p-card-body {
      padding: 0.5rem
    }

    ::ng-deep .p-card .p-card-title {
      font-family: 'Martel';
      font-size: 0.8rem;
      font-weight: 100;
      text-align: center;
      height: 30px;
      align-content: center;
    }

    ::ng-deep .badge-death .p-badge {
      background-color: #171717; /* Cinza Escuro */
      color: #fff;
    }

    ::ng-deep .badge-fire .p-badge {
      background-color: #ef4444; /* Vermelho */
      color: #fff;
    }

    ::ng-deep .badge-ice .p-badge {
      background-color: #60a5fa; /* Azul Claro */
      color: #fff;
    }

    ::ng-deep .badge-holy .p-badge {
      background-color: #facc15; /* Amarelo */
      color: #000;
    }

    ::ng-deep .badge-energy .p-badge {
      background-color: #553bf6; /* Roxo */
      color: #fff;
    }

    ::ng-deep .badge-earth .p-badge {
      background-color: #22c55e; /* Verde */
      color: #fff;
    }

    ::ng-deep .badge-physical .p-badge {
      background-color: #a3a3a3; /* Cinza Médio */
      color: #fff;
    }

    .image-container {
      position: relative;
      display: inline-block;
    }

    .badge-overlay {
      position: absolute;
      top: 0;
      right: -20px;
      transform: translate(50%, -50%);
      z-index: 10;
    }

    ::ng-deep .equip.highlight .p-card {
      background: #4ade80;
    }

    ::ng-deep .equip.highlight-red .p-card {
      background: #ff6767;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgb(0 0 0 / 95%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      border: 8px solid rgba(255, 255, 255, 0.3);
      border-top: 8px solid #ffffff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    ::ng-deep .sell-all .p-card .p-card-body .p-card-content {
      height: 0px;
    }

    ::ng-deep .sell-all .p-card .p-card-title {
      font-size: 2rem
    }
  `],
  providers: [ConfirmationService, MessageService]
})
export class PerfilComponent {

  character: Character = new Character;
  items: MenuItem[] = [];

  potionMenu$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(
    [] as MenuItem[]
  );

  equipedItemsMenu$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(
    [] as MenuItem[]
  );

  depotItemsMenu$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(
    [] as MenuItem[]
  );
  
  showItemDetailSelected: Item;
  showItemDetail: boolean = false;
  selectedSkillLabel: string = '';
  selectedSkillValue: number = 10;

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

  showPotionMenu(potion: CharacterPotion): void {
    this.potionMenu$.next([
      {
        label: 'Usar',
        icon: 'pi pi-fw pi-check',
        command: () => this.usePotion(potion),
      }
    ]);
  }

  showEquipedItemsMenu(item: Item): void {
    if (item) {
      this.equipedItemsMenu$.next([
        {
          label: 'Detalhes',
          icon: 'pi pi-fw pi-exclamation-circle',
          command: () => this.showEquipDetail(item),
        },
        {
          label: 'Remover',
          icon: 'pi pi-fw pi-arrow-circle-down',
          command: () => this.deequip(item, true),
        }
      ]);
    }
  }

  showDepotItemsMenu(item: Item, quantity: number): void {
    if (item) {
      this.depotItemsMenu$.next([
        {
          label: 'Detalhes',
          icon: 'pi pi-fw pi-exclamation-circle',
          command: () => this.showEquipDetail(item),
        },
        {
          label: 'Equipar',
          icon: 'pi pi-fw pi-arrow-circle-up',
          command: () => this.equip(item),
        },
        {
          label: 'Vender 1 (' + item.gold + ')',
          icon: 'pi pi-fw pi-dollar',
          command: () => this.sellItem(item),
        },
        {
          label: 'Vender Todos (' + item.gold*quantity + ')',
          icon: 'pi pi-fw pi-dollar',
          command: () => this.sellAllItemsById(item),
        }
      ]);
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
            if (this.character.slot2Item) {
              switch(this.character.slot2Item.type) {
                case 'sword':
                  this.selectedSkillLabel = 'Sword Fighting'
                  this.selectedSkillValue = this.character.sword;    
                  break;
                case 'axe':
                    this.selectedSkillLabel = 'Axe Fighting'
                    this.selectedSkillValue = this.character.axe;    
                    break;
                case 'club':
                  this.selectedSkillLabel = 'Club Fighting'
                  this.selectedSkillValue = this.character.club;    
                  break;
                case 'distance':
                case 'bolt':
                case 'arrow':
                  this.selectedSkillLabel = 'Distance Fighting'
                  this.selectedSkillValue = this.character.distance;    
                  break;
                case 'rod':
                case 'wand':
                  this.selectedSkillLabel = 'Magic Level'
                  this.selectedSkillValue = this.character.magicLevel;    
                  break;
              }
            } else {
              this.selectedSkillLabel = 'Arma não equipada'
              this.selectedSkillValue = 10;
            }
            if (this.character.level >= 20 && this.character.vocationId > 1 && this.character.vocationId < 6) {
              this.labelPromotion = this.character.vocationId == 2 ? 'Elike Knight' : this.character.vocationId == 3 ? 'Royal Paladin' : this.character.vocationId == 4 ? 'Elder Druid' : 'Master Sorcerer'
            }
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

  showEquipDetail(item: Item) {
    this.showItemDetailSelected = item
    this.showItemDetail = true;
  }
 
  equip(item: Item) {
    if (item.levelRequired > this.character.level) {
      this.service.add({ key: 'tst', severity: 'danger', summary: 'Não Permitido', detail: 'Você precisa de level ' + item.levelRequired + ' para equipar esse item' });
      return;
    }
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
        if (item.twoHanded == 1 && this.character.slot4Item) {
          this.deequip({...this.character.slot4Item}, false)
        }
        break;
      case 3:
        if (this.character.slot3Item) {
          this.deequip({...this.character.slot3Item}, false)
        }
        break;
      case 4:
        if (this.character.slot2Item?.twoHanded == 1) {
          this.service.add({ key: 'tst', severity: 'danger', summary: 'Não Permitido', detail: 'Você não pode equipar esse item pois está usando uma arma de duas mãos' });
          return;
        }
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
      case 8:
        if (this.character.slotAmulet) {
          this.deequip({...this.character.slotAmulet}, false)
        }
        break;
      case 9:
        if (this.character.slotRing) {
          this.deequip({...this.character.slotRing}, false)
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

  usePotion(potion: CharacterPotion) {
    if (potion.potion.type === 'life') {
      if (this.character.life == this.character.maxLife) {
        this.service.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: 'Sua vida está cheia. Não é possível usar potion agora.' });
        potion.highlightRed = true;
        setTimeout(() => {
          potion.highlightRed = false;
        }, 500)
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
        this.service.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: 'Sua mana está cheia. Não é possível usar potion agora.' });
        potion.highlightRed = true;
        setTimeout(() => {
          potion.highlightRed = false;
        }, 500)
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
    potion.highlight = true;
    setTimeout(() => {
      potion.highlight = false;
    }, 500)
  }

  getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  sellAllItems() {
    this.characterService.sellAllItems(this.character.id);
    this.character.items = []
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: 'Todos os items foram vendidos com sucesso.' });
    this.loading = true;
    setTimeout(() => {
      window.location.reload();
    }, 5000)
  }

  sellAllItemsById(item: Item) {
    this.characterService.sellAllItemsById(this.character.id, item.id);
    this.character.items = []
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: 'Todos os "' + item.name + '" foram vendidos com sucesso.' });
    this.loading = true;
    setTimeout(() => {
      window.location.reload();
    }, 2000)
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

  confirmSellAll(event: Event) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: 'Tem certeza que deseja vender todos os seus items?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
          this.sellAllItems();
        },
    });
  }
}
