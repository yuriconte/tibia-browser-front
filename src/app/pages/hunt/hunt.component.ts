import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { BestiaryService } from 'src/app/service/bestiary.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { Bestiary } from 'src/app/model/bestiary.model';
import { Creature } from 'src/app/model/creature.model';
import { Item } from 'src/app/model/item.model';
import { CharacterItem } from 'src/app/model/character-item.model';

@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.component.html',
  styles: [`
    ::ng-deep .health-bar .p-progressbar .p-progressbar-value {
      background-color: #f87171; /* Vermelho para saúde */
    }

    ::ng-deep .mana-bar .p-progressbar .p-progressbar-value {
      background-color: #7dd3fc; /* Azul para mana */
    }

    ::ng-deep .exp-bar .p-progressbar .p-progressbar-value {
      background-color: #94a3b8; 
    }

    ::ng-deep .p-selectbutton .p-button.p-highlight:nth-child(2) {
        background-color: #fdba74; /* Cor para o segundo botão */
        color: #ffffff;
    }

    ::ng-deep .p-selectbutton .p-button.p-highlight:last-child {
        background-color: #f87171; /* Cor para o último botão */
        color: #ffffff;
    }

    ::ng-deep .p-buttonset .p-button:first-of-type, ::ng-deep .p-buttonset .p-button:last-of-type {
      width: 33.3%;
    }

    ::ng-deep .p-buttonset .p-button:not(:first-of-type):not(:last-of-type) {
      padding-left: 10px;
      width: 33.3%;
    }

    p-inputnumber {
      display: grid;
    }
  `],
  providers: [MessageService]
})
export class HuntComponent {
  msgs: Message[] = [];

  creatures: Bestiary[] = [];
  selectedCreature: Bestiary | null = null;
  character: Character = new Character;
  
  minLife: number = 100;
  huntStyle: any[] = [];
  huntStyleSelected: any;

  statusHunt: boolean = false;

  atkInterval;

  countMonsterKill: number = 0;
  totalExpEarned: number = 0;
  totalGoldEarned: number = 0;
  avgExpHour: string = "0";
  expNextLevel:number = 0;
  expPreviousLevel:number = 0;
  monster: Creature;
  lootDrop: CharacterItem[] = [];

  constructor(private characterService: CharacterService,
    private bestiaryService: BestiaryService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
    this.loadBestiary();
    this.huntStyle = [
      { name: 'Ataque', value: 1 },
      { name: 'Balanceado', value: 0.75 },
      { name: 'Defesa', value: 0.5 }
    ];
    this.huntStyleSelected = this.huntStyle[0];
  }

  ngOnDestroy() {
    if (this.atkInterval) {
      clearInterval(this.atkInterval);
    }
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data
            this.character.totalArmor = (this.character.slot1Item?.armor || 0) + (this.character.slot3Item?.armor || 0) + (this.character.slot5Item?.armor || 0) + (this.character.slot6Item?.armor || 0)
            this.character.totalAtk = (this.character.slot2Item?.atk || 0);
            this.character.totalDef = (this.character.slot2Item?.def || 0) + (this.character.slot4Item?.def || 0);
            this.expNextLevel = this.calculateExpLevelFormula(this.character.level)
            this.expPreviousLevel = this.calculateExpLevelFormula(this.character.level-1)
            if (this.character.level >= 8 && this.character.vocationId === 1) {
              this.msgs = []
              this.msgs.push({ severity: 'info', summary: 'Level 8', detail: "Escolha uma vocação no seu perfil: Knight, Paladin, Druid, Sorcerer" });
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

  loadBestiary() {
    this.bestiaryService.getAll().subscribe({
      next: (data) => {
        this.creatures = data || []
        this.selectedCreature = this.creatures[0];
        this.prepareCreatures();
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
      }
    });
  }

  prepareCreatures() {
    this.creatures.map((creature, index) => {
        this.testeDificuldade(index);
        creature.creature.items.sort((itemA, itemB) => {
          const rateOrder = { comum: 1, incomum: 2, raro: 3, ultra: 4 };
          //return rateOrder[itemA.rate] - rateOrder[itemB.rate];
          const rateComparison = rateOrder[itemA.rate] - rateOrder[itemB.rate];
          if (rateComparison === 0) {
            return itemA.item.gold - itemB.item.gold;
          }
          return rateComparison;
        });
    });
  }

  calculateExpLevelFormula(x: number): number {
    x += 1;
    return (50 * Math.pow(x - 1, 3) - 150 * Math.pow(x - 1, 2) + 400 * (x - 1)) / 3;
  }

  cancelHunt() {
    this.statusHunt = false;
    clearInterval(this.atkInterval); 
  }

  startHunt() {
    this.statusHunt = true;

    const character = this.character

    this.monster = { ...this.selectedCreature.creature }
    this.monster.maxLife = this.monster.life
    let bestiaryId = this.selectedCreature.id

    this.countMonsterKill = 0;
    let countTimeToKill = 0;

    this.atkInterval = setInterval(() => {
      countTimeToKill += 1;
      let damage = this.getDamage(character, this.monster)
      this.monster.life -= damage.cDamage
      if (this.monster.life > 0) {
        character.life -= damage.mDamage
        if (character.life <= 0) {
          this.statusHunt = false;
          //TODO calculo de morte, perda de xp, level, max_vida, max_mana, skills
          clearInterval(this.atkInterval);
        } else if (character.life <= this.minLife) {
          this.statusHunt = false;
          this.characterService.updateCharacterLifeManaStamina(character.id);
          clearInterval(this.atkInterval);
        }
      } else {
        this.countMonsterKill += 1
        this.totalExpEarned = this.countMonsterKill*this.monster.experience
        this.avgExpHour = ((this.countMonsterKill*this.monster.experience)/countTimeToKill*3600/1000).toFixed(1) + 'k'

        if (character.life + 1 <= character.maxLife) {
          character.life += 1
        }
        if (character.mana + 1 <= character.maxMana) {
          character.mana += 1
        }
        character.experience += this.monster.experience;
        let goldEarned = Math.round(this.getRandomInRange(this.monster.minGold, this.monster.maxGold));
        this.totalGoldEarned += goldEarned;
        let itemLooted: number[] = [];
        if (this.monster.items) {
          this.monster.items.forEach(item => {
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
              this.msgs.push({ severity: 'success', summary: 'Drop', detail: "Dropou um " + item.item.name });
            }
          })
        }
        this.characterService.updateCharacter(character.id, bestiaryId, this.monster.experience, character.life, character.mana, ((this.countMonsterKill*this.monster.experience)/countTimeToKill*3600), goldEarned, itemLooted);
        if (character.experience >= this.expNextLevel) {
          this.characterService.increaseLevel(character.id);
          character.level += 1;
          character.maxLife += 5;
          character.maxMana += 5;
          this.expNextLevel = this.calculateExpLevelFormula(character.level)
          this.expPreviousLevel = this.calculateExpLevelFormula(character.level-1)
          if (character.level >= 8 && character.vocationId === 1 && this.msgs.length == 0) {
            this.msgs.push({ severity: 'info', summary: 'Level 8', detail: "Escolha uma vocação no seu perfil: Knight, Paladin, Druid, Sorcerer" });
          }
        }
        this.monster = { ...this.selectedCreature.creature }
        this.monster.maxLife = this.monster.life
      }
    }, 1000);
    
  }

  getDamage(character:Character, monster:Creature) {
    /* (0.085*{D}*{X}*{Y})+({L}/5)
    X = Ataque da arma
    Y = Skills do jogador
    L = Level do jogador
    D = Fator de dano (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
    */
  
    let skill = character.slot2Item?.type == 'sword' ? character.sword : character.slot2Item?.type == 'axe' ? character.axe : character.slot2Item?.type == 'club' ? character.club : character.slot2Item?.type == 'distance' ? character.distance : 10

    let characterMaxDamage = Math.round((0.085*this.huntStyleSelected.value*character.totalAtk*skill)+(character.level/5)) 

    /* Armadura mínima (ArmaduraTotal * 0.475)
      Armadura Máxima ((ArmaduraTotal * 0.95) - 1)
      */
    
    let characterMinArmor = Math.round(character.totalArmor*0.475)
    let characterMaxArmor = Math.round(character.totalArmor*0.95-1)

    let monsterMinArmor = Math.round(monster.armor*0.475)
    let monsterMaxArmor = Math.round(monster.armor*0.95-1)

    /* {A}-({B}*{D})/({E}*100)-({A}/100)*{C}
      A = ataque da criatura
      B = defesa total
      C = armadura total
      D = shielding
      E = fator de defesa  (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
      */
    
    let characterDamage = Math.round(this.getRandomInRange(0, characterMaxDamage))
    let monsterDamage = Math.round(this.getRandomInRange(0, monster.maxDamage))

    let characterFinalDamage = Math.round(characterDamage-(0*0)/(1*100)-(characterDamage/100)*this.getRandomInRange(monsterMinArmor, monsterMaxArmor))
    let monsterFinalDamage = Math.round(monsterDamage-(character.totalDef*character.shielding)/(this.huntStyleSelected.value*100)-(monsterDamage/100)*this.getRandomInRange(characterMinArmor, characterMaxArmor))

    return {cDamage: characterFinalDamage, mDamage: monsterFinalDamage}
  }

  getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }


  testeDificuldade(index: number) {
    const character = {...this.character}

    let monster = {...this.creatures[index].creature}
    let countTimeToKill = 0;

    let interval = setInterval(() => {
      countTimeToKill += 1;
      let damage = this.getDamage(character, monster)
      monster.life -= damage.cDamage
      if (monster.life > 0) {
        character.life -= damage.mDamage
        if (character.life <= 0) {
          clearInterval(interval);
          this.creatures[index].creature.tagType = "danger"
          this.creatures[index].creature.tagLabel = "Extremo"
          this.creatures[index].disabled = true;
          let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].id)?.expHour || 0;
          this.creatures[index].creature.expHour = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
        }
      } else {
        if (countTimeToKill <= 10) {
          this.creatures[index].creature.tagType = "success"
          this.creatures[index].creature.tagLabel = "Fácil"
        } else if (countTimeToKill <= 30) {
          this.creatures[index].creature.tagType = "warning"
          this.creatures[index].creature.tagLabel = "Médio"
        } else if (countTimeToKill <= 60) {
          this.creatures[index].creature.tagType = "danger"
          this.creatures[index].creature.tagLabel = "Difícil"
        } else {
          this.creatures[index].creature.tagType = "danger"
          this.creatures[index].creature.tagLabel = "Muito Difícil"
        }
        let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].id)?.expHour || 0;
        this.creatures[index].creature.expHour = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
        clearInterval(interval);
      }
    }, 10);
  }

  shouldDrop(rarity: string): boolean {
    const dropChance = rarity === 'comum' ? 0.20 : rarity === 'incomum' ? 0.10 : rarity === 'raro' ? 0.5 : 0.01
    const randomValue = Math.random();
    return randomValue <= dropChance;
  }

}
