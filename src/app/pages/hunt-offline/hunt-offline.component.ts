import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { CharacterBestiary } from 'src/app/model/character-bestiary.model';
import { CharacterItem } from 'src/app/model/character-item.model';

@Component({
  selector: 'app-hunt-offline',
  templateUrl: './hunt-offline.component.html',
  styles: [`

    ::ng-deep .exp-bar .p-progressbar .p-progressbar-value {
      background-color: #a855f7; 
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
       ::ng-deep .health-bar .p-progressbar .p-progressbar-value {
      background-color: #f87171; /* Vermelho para saúde */
    }

    ::ng-deep .mana-bar .p-progressbar .p-progressbar-value {
      background-color: #38bdf8; /* Azul para mana */
    }

    ::ng-deep .exp-bar .p-progressbar .p-progressbar-value {
      background-color: #a855f7; 
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

    ::ng-deep .p-card .p-card-title {
      font-family: 'Martel';
      font-size: 1rem;
      font-weight: 100;
      text-align: center;
      height: 30px;
      align-content: center;
    }

    ::ng-deep .p-badge {
      color: white;
      font-weight: 100;
    }

    ::ng-deep .badge-physical .p-badge, ::ng-deep .tag-physical .p-tag {
      background-color: #a3a3a3; /* Cinza Médio */
      color: #fff;
    }
  `],
  providers: [MessageService]
})
export class HuntOfflineComponent {
 
  character: Character = new Character;
  creatures: CharacterBestiary[] = [];
  selectedCreature: CharacterBestiary;

  remainingTime: number;
  timerInterval: any;
  progress: string;

  selectedTimeOption: any;
  timeOptions: any[] = [
    {value: 1, name: "1 Hora"}, 
    {value: 2, name: "2 Horas"}, 
    {value: 4, name: "4 Horas"}, 
    {value: 8, name: "8 Horas"}, 
    {value: 12, name: "12 Horas"}
  ]

  lootDrop: CharacterItem[] = [];
  expNextLevel:number = 0;
  expPreviousLevel:number = 0;

  bonusType: any[] = [];
  bonusTypeSelected: any;

  showSelectButton: boolean = true;

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
    this.selectedTimeOption = this.timeOptions[0]
    this.bonusType = [
      { name: '+5% (5k/h)', value: 5, cost: 5000 },
      { name: '+10% (15k/h)', value: 10, cost: 15000 },
      { name: '+15% (50k/h)', value: 15, cost: 50000 },
    ];
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
            this.expNextLevel = this.calculateExpLevelFormula(this.character.level)
            this.expPreviousLevel = this.calculateExpLevelFormula(this.character.level-1)
            this.creatures = this.character.bestiary?.filter(b => b.totalKills >= b.bestiary.totalKillsTier1) || []
            if (this.creatures?.length > 0) {
              this.calcExpCreatures();
              this.selectedCreature = this.creatures[0]
            } else {
              this.selectedCreature = null;
            }
            if (this.character.huntOfflineDate) {
              this.remainingTime = (this.character.huntOfflineTimeInHours*60*60) - this.getDifferenceFromNowInSeconds(this.character.huntOfflineDate);
              this.selectedCreature = this.creatures.find(c => c.bestiaryId === this.character.huntOfflineBestiaryId) || this.creatures[0] 
              if (this.character.bonusType > 0) {
                this.bonusTypeSelected = this.bonusType.find(b => b.value === this.character.bonusType) || 0
              }
              if (this.character.huntOfflineTimeInHours > 0) {
                this.selectedTimeOption = this.timeOptions.find(t => t.value === this.character.huntOfflineTimeInHours) || 0
              }
              this.calcExpCreatures();
              this.initHunt();
            } else {
              this.remainingTime = this.selectedTimeOption?.value*60*60 || 60*60;
            }
        },
        error: () => {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
        }
      });
    } else {
      this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
    }
  }

  onBonusChange(event: any) {
    this.calcExpCreatures();
  }

  calcExpCreatures() {
    this.creatures.map((creature, index) => {
      let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].bestiaryId)?.expHour || 0;
      creature.expHourOrigStr = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
      creature.totalPercentage = this.calcTotalPorcentage(creature);
      expHour = expHour*(creature.totalPercentage/100)
      creature.expHourNum = expHour;
      creature.expHourStr = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
      creature.bestiary.creature?.items.sort((itemA, itemB) => {
        const rateOrder = { comum: 1, incomum: 2, raro: 3, ultra: 4 };
        const rateComparison = rateOrder[itemA.rate] - rateOrder[itemB.rate];
        if (rateComparison === 0) {
          return itemA.item.gold - itemB.item.gold;
        }
        return rateComparison;
      });
    });
    this.creatures.sort((a, b) => {
      const experienceA = a.bestiary.creature.experience;
      const experienceB = b.bestiary.creature.experience;
      return experienceA - experienceB;
    });
  }

  calcTotalPorcentage(creature: CharacterBestiary) {
    let total = 0;
    if (creature.totalKills >= creature.bestiary.totalKillsTier3) {
      total = 20;
    } else if (creature.totalKills >= creature.bestiary.totalKillsTier2) {
      total = 15;
    } else if (creature.totalKills >= creature.bestiary.totalKillsTier1) {
      total = 10;
    } else {
      total = 0;
    }
    if (this.character.slotAmulet?.bonusSpeed) {
      total += (this.character.slotAmulet?.bonusSpeed/10)
    }
    if (this.character.slot1Item?.bonusSpeed) {
      total += (this.character.slot1Item?.bonusSpeed/10)
    }
    if (this.character.slot2Item?.bonusSpeed) {
      total += (this.character.slot2Item?.bonusSpeed/10)
    }
    if (this.character.slot3Item?.bonusSpeed) {
      total += (this.character.slot3Item?.bonusSpeed/10)
    }
    if (this.character.slot4Item?.bonusSpeed) {
      total += (this.character.slot4Item?.bonusSpeed/10)
    }
    if (this.character.slotRing?.bonusSpeed) {
      total += (this.character.slotRing?.bonusSpeed/10)
    }
    if (this.character.slot5Item?.bonusSpeed) {
      total += (this.character.slot5Item?.bonusSpeed/10)
    }
    if (this.character.slotAmmo?.bonusSpeed) {
      total += (this.character.slotAmmo?.bonusSpeed/10)
    }
    if (this.character.slot6Item?.bonusSpeed) {
      total += (this.character.slot6Item?.bonusSpeed/10)
    }
    if (this.bonusTypeSelected?.value > 0) {
      total += (this.bonusTypeSelected?.value)
    }
    return total;
  }

  calculateExpLevelFormula(x: number): number {
    x += 1;
    return (50 * Math.pow(x - 1, 3) - 150 * Math.pow(x - 1, 2) + 400 * (x - 1)) / 3;
  }

  startHunt() {
    this.character.huntOfflineDate = new Date();
    this.character.huntOfflineTimeInHours = this.selectedTimeOption?.value
    this.remainingTime = (this.character.huntOfflineTimeInHours*60*60);
    this.characterService.startHuntOffline(this.character.id, this.selectedTimeOption?.value || 1, this.selectedCreature.bestiaryId, this.bonusTypeSelected?.value || 0, this.bonusTypeSelected?.cost*this.selectedTimeOption?.value || 0)
    this.initHunt()
  }

  initHunt() {
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      let totalTime = (this.character.huntOfflineTimeInHours*60*60);
      this.progress = (((totalTime - this.remainingTime) / totalTime) * 100).toFixed(0);
      if (this.remainingTime <= 0) {
        this.finishHunt();
      }
    }, 1000);
  }

  finishHunt() {
    // calculo exp ganha
    let expEarned = Math.round(this.selectedCreature.expHourNum*this.character.huntOfflineTimeInHours);
    // calculo loot ganho
    let itemLooted: number[] = [];
    let countTryLoot = this.selectedCreature.totalKills >= this.selectedCreature.bestiary.totalKillsTier3 ? 6 :this.selectedCreature.totalKills >= this.selectedCreature.bestiary.totalKillsTier2 ? 4 : 2
    for(let i = 0; i < (this.character.huntOfflineTimeInHours*countTryLoot); i++) {
      if (this.selectedCreature.bestiary.creature.items) {
        this.selectedCreature.bestiary.creature.items.forEach(item => {
          let drop = this.shouldDrop(item.rate)
          if (drop) {
            let characterItem: CharacterItem = {characterId: this.character.id, item: item.item, quantity: 1}
            if (this.lootDrop) {
              const existingItem = this.lootDrop.find(
                (dropItem: CharacterItem) => dropItem.item.id === item.item.id
              );            
              if (existingItem) {
                existingItem.quantity += 1;
              } else {
                this.lootDrop.push(characterItem);
              }
            } else {
              this.lootDrop = [characterItem];
            }
            itemLooted.push(item.item.id)
          }
        })
      }
    }
    this.remainingTime = this.selectedTimeOption?.value*60*60 || 60*60;
    let goldEarned = (this.selectedCreature.bestiary.creature.maxGold*this.character.huntOfflineTimeInHours*2);
    this.characterService.updateCharacter(this.character.id, null, this.character.huntOfflineBestiaryId, expEarned, this.character.life, this.character.mana, this.selectedCreature.expHour, goldEarned, itemLooted, null);
    while (this.character.experience + expEarned >= this.expNextLevel) {
      this.characterService.increaseLevel(this.character.id);
      this.character.level++;
      this.expNextLevel = this.calculateExpLevelFormula(this.character.level);
    }
    this.character.experience += expEarned;
    this.character.huntOfflineDate = null;
    this.character.huntOfflineTimeInHours = null;
    this.character.huntOfflineBestiaryId = null;
    this.characterService.cancelHuntOffline(this.character.id)
    clearInterval(this.timerInterval);
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua caçada rendeu: " + expEarned + " de experiência e " + goldEarned + " de gold."});
  }

  shouldDrop(rarity: string): boolean {
    const dropChance = rarity === 'comum' ? 0.10 : rarity === 'incomum' ? 0.05 : rarity === 'raro' ? 0.01 : 0.001
    const randomValue = Math.random();
    return randomValue <= dropChance;
  }

  cancelHunt() {
    this.character.huntOfflineDate = null;
    this.character.huntOfflineTimeInHours = null;
    this.remainingTime = this.selectedTimeOption?.value*60*60 || 60*60;
    this.characterService.cancelHuntOffline(this.character.id)
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getDifferenceFromNowInSeconds(dateString: any): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = Math.abs(now.getTime() - date.getTime());
    return Math.floor(diffInMs / 1000);
  }

  onTimeChange(event: any) {
    this.remainingTime = this.selectedTimeOption?.value*60*60 || 60*60;
    this.bonusType.forEach(b => {
      if (this.character.balance < b.cost*this.selectedTimeOption?.value) {
        b.disabled = true;
        if (this.bonusTypeSelected?.value === b.value) {
          this.bonusTypeSelected = null;
        }
      } else {
        b.disabled = false;
      }
    });
    this.calcExpCreatures();
    this.showSelectButton = false; // Oculta o botão temporariamente
    setTimeout(() => {
      this.showSelectButton = true; // Mostra novamente para reinicializar
    }, 0);
  }
 
}
