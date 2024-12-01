import { Component } from '@angular/core';
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

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
    this.selectedTimeOption = this.timeOptions[0]
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
              this.creatures.map((creature, index) => {
                let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].bestiaryId)?.expHour || 0;
                creature.expHourOrigStr = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
                let expHourBonus = this.character.slot6Item?.id === 92 ? expHour*0.05 : 0
                if (creature.totalKills >= creature.bestiary.totalKillsTier3) {
                  expHour = expHour*0.2
                } else if (creature.totalKills >= creature.bestiary.totalKillsTier2) {
                  expHour = expHour*0.15
                } else if (creature.totalKills >= creature.bestiary.totalKillsTier1) {
                  expHour = expHour*0.1
                } else {
                  expHour = 0;
                }
                expHour += expHourBonus
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
              this.selectedCreature = this.creatures[0]
            } else {
              this.selectedCreature = null;
            }
            if (this.character.huntOfflineDate) {
              this.remainingTime = (this.character.huntOfflineTimeInHours*60*60) - this.getDifferenceFromNowInSeconds(this.character.huntOfflineDate);
              this.selectedCreature = this.creatures.find(c => c.bestiaryId === this.character.huntOfflineBestiaryId) || this.creatures[0]
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

  calculateExpLevelFormula(x: number): number {
    x += 1;
    return (50 * Math.pow(x - 1, 3) - 150 * Math.pow(x - 1, 2) + 400 * (x - 1)) / 3;
  }

  startHunt() {
    this.character.huntOfflineDate = new Date();
    this.character.huntOfflineTimeInHours = this.selectedTimeOption?.value
    this.remainingTime = (this.character.huntOfflineTimeInHours*60*60);
    this.characterService.startHuntOffline(this.character.id, this.selectedTimeOption?.value || 1, this.selectedCreature.bestiaryId)
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
  }
 
}
