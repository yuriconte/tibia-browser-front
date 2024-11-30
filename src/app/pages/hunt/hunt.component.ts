import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { BestiaryService } from 'src/app/service/bestiary.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { Bestiary } from 'src/app/model/bestiary.model';
import { Creature } from 'src/app/model/creature.model';
import { CharacterItem } from 'src/app/model/character-item.model';
import { Spell } from 'src/app/model/spell.model';
import { SpellService } from 'src/app/service/spell.service';
import { CharacterPotion } from 'src/app/model/character-potion.model';

@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.component.html',
  styles: [`
    ::ng-deep .health-bar .p-progressbar .p-progressbar-value {
      background-color: #f87171; /* Vermelho para saúde */
    }

    ::ng-deep .mana-bar .p-progressbar .p-progressbar-value {
      background-color: #38bdf8; /* Azul para mana */
    }

    ::ng-deep .mana-button .p-button {
      background: #38bdf8; /* Azul para mana */
    }

    ::ng-deep .exp-bar .p-progressbar .p-progressbar-value {
      background-color: #a855f7; 
    }

    ::ng-deep .p-selectbutton .p-button.p-highlight:nth-child(2) {
        background-color: #fdba74; 
        color: #ffffff;
    }

    ::ng-deep .p-selectbutton .p-button.p-highlight:last-child {
        background-color: #f87171; 
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
    .additional-info {
      font-size: 0.9em;
      color: #555;
    }

    .additional-info span {
      display: inline-block;
      margin-right: 10px;
    }
      ::ng-deep .p-tag {
        width: 100%;
        text-align: center;
      }

      .font-tibia {
      font-family: var(--font-family-tibia);
    }

    ::ng-deep .exp .p-tag {
      background: #a855f7
    }

    ::ng-deep .inactive .p-tag {
      background: #424b57
    }
  `],
  providers: [MessageService]
})
export class HuntComponent {
  msgs: Message[] = [];

  creatures: Bestiary[] = [];
  selectedCreature: Bestiary | null = null;
  character: Character = new Character;
  
  huntStyle: any[] = [];
  huntStyleSelected: any;
  
  statusHunt: boolean = false;

  stats: any[] = [
    {label: 'Dano Basico', value: 0},
    {label: 'Dano Sofrido', value: 0},
    {label: 'Magia Dano', value: 0},
    {label: 'Magia Cura', value: 0},
    {label: 'Potion Cura', value: 0},
    {label: 'Potion Mana', value: 0}
  ]
  
  atkInterval;
  lifeInterval;
  manaInterval;
  
  countMonsterKill: number = 0;
  totalExpEarned: number = 0;
  totalGoldEarned: number = 0;
  avgExpHour: string = "0";
  expNextLevel:number = 0;
  expPreviousLevel:number = 0;
  monster: Creature;
  lootDrop: CharacterItem[] = [];
  
  minLife: number;

  spellsHeal: Spell[] = [];
  useSpellHealing: boolean = false;
  selectedSpellHeal: Spell = null;
  lifeToUseSpell: number = 100;

  spellsStrike: Spell[] = [];
  useSpellStrike: boolean = false;
  selectedSpellStrike: Spell = null;
  manaToUseSpell: number = 100;

  potionsHealing: CharacterPotion[] = [];
  usePotionsHealing: boolean = false;
  selectedPotionHealing: CharacterPotion = null;
  lifeToUsePotion: number = 30;

  potionsMana: CharacterPotion[] = [];
  usePotionsMana: boolean = false;
  selectedPotionMana: CharacterPotion = null;
  manaToUsePotion: number = 10;

  exaustedSpellHealing: number = 0;
  exaustedSpellStrike: number = 0;
  exaustedPotionHealing: number = 0;
  exaustedPotionMana: number = 0;

  constructor(private characterService: CharacterService,
    private bestiaryService: BestiaryService,
    private spellService: SpellService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
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
    if (this.lifeInterval) {
      clearInterval(this.lifeInterval);
    }
    if (this.manaInterval) {
      clearInterval(this.manaInterval);
    }
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data
            if (this.character.level >= 8 && this.character.vocationId > 1) {
              this.loadSpellsHeal();
              this.loadSpellsStrike();
            }
            this.character.totalArmor = (this.character.slot1Item?.armor || 0) + (this.character.slot3Item?.armor || 0) + (this.character.slot5Item?.armor || 0) + (this.character.slot6Item?.armor || 0)
            
            if (this.character.slot2Item?.type === 'arrow' || this.character.slot2Item?.type === 'bolt') {
              this.character.totalAtk = (this.character.slot2Item?.atk || 0) + (this.character.slot2Item?.type === this.character.slotAmmo?.type ? this.character.slotAmmo?.atk || 0 : 0);
            } else {
              this.character.totalAtk = (this.character.slot2Item?.atk || 0);
            }

            this.character.totalDef = (this.character.slot2Item?.def || 0) + (this.character.slot4Item?.def || 0);
            this.character.magicDamage = this.character.slot2Item?.type === "wand" || this.character.slot2Item?.type === "rod";
            this.expNextLevel = this.calculateExpLevelFormula(this.character.level)
            this.expPreviousLevel = this.calculateExpLevelFormula(this.character.level-1)
            if (this.character.level >= 8 && this.character.vocationId === 1) {
              this.msgs = []
              this.msgs.push({ severity: 'info', summary: 'Level 8', detail: "Escolha uma vocação no seu perfil: Knight, Paladin, Druid, Sorcerer" });
            }
            if (this.character.level >= 20 && this.character.vocationId > 2 && this.character.vocationId < 6) {
              this.msgs = []
              this.msgs.push({ severity: 'info', summary: 'Level 20', detail: "Você pode ser promovido por 20k no seu perfil." });
            }
            if (this.character.potions?.length > 0) {
              this.potionsHealing = this.character.potions?.filter(cpot => cpot.potion.type === 'life');
              if (this.potionsHealing?.length > 0) {
                this.selectedPotionHealing = this.potionsHealing[0]
              }
              this.potionsMana = this.character.potions?.filter(cpot => cpot.potion.type === 'mana');
              if (this.potionsMana?.length > 0) {
                this.selectedPotionMana = this.potionsMana[0]
              }
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
            this.loadBestiary();
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

  loadSpellsHeal() {
    this.spellService.getHeal().subscribe({
      next: (data) => {
        if (data) {
          this.spellsHeal = data.filter(spell => (spell.vocationIds.split(',').includes(this.character.vocationId.toString()) && spell.levelRequired <= this.character.level));
        } else {
          this.spellsHeal = []
        }
        if (this.spellsHeal?.length > 0) {
          this.selectedSpellHeal = this.spellsHeal[0];
        }
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
      }
    });
  }

  loadSpellsStrike() {
    this.spellService.getStrike().subscribe({
      next: (data) => {
        if (data) {
          this.spellsStrike = data.filter(spell => (spell.vocationIds.split(',').includes(this.character.vocationId.toString()) && spell.levelRequired <= this.character.level));
        } else {
          this.spellsStrike = []
        }
        if (this.spellsStrike?.length > 0) {
          this.selectedSpellStrike = this.spellsStrike[0];
        }
        setTimeout(()=> {
          this.loadLocalStorage();
        }, 500)
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
      }
    });
  }

  prepareCreatures() {
    this.creatures.map((creature, index) => {
        //this.testeDificuldade(index);
        let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].id)?.expHour || 0;
        creature.creature.expHour = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
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

  loadLocalStorage() {
    const savedSettings = localStorage.getItem(this.character.name + 'Settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (this.character.maxLife >= settings.minLife) {
        this.minLife = settings.minLife || 0;
      }
      if (this.spellsHeal?.length > 0) {
        this.useSpellHealing = settings.useSpellHealing;
        if (settings.selectedSpellHeal?.id && this.spellsHeal.some(spell => spell.id === settings.selectedSpellHeal.id)) {
          this.selectedSpellHeal = settings.selectedSpellHeal;
        }
        if (this.character.maxLife >= settings.lifeToUseSpell) {
          this.lifeToUseSpell = settings.lifeToUseSpell;
        }
      }
      if (this.spellsStrike?.length > 0) {
        this.useSpellStrike = settings.useSpellStrike;
        if (settings.selectedSpellStrike?.id && this.spellsStrike.some(spell => spell.id === settings.selectedSpellStrike.id)) {
          this.selectedSpellStrike = settings.selectedSpellStrike;
        }
        if (this.character.maxMana >= settings.manaToUseSpell) {
          this.manaToUseSpell = settings.manaToUseSpell;
        }
      }
      if (this.potionsHealing?.length > 0) {
        this.usePotionsHealing = settings.usePotionsHealing;
        if (settings.selectedPotionHealing?.potion?.id && this.potionsHealing.some(potion => potion.potion.id === settings.selectedPotionHealing.potion.id)) {
          this.selectedPotionHealing = this.potionsHealing.find(potion => potion.potion.id === settings.selectedPotionHealing.potion.id);
        }
        if (this.character.maxLife >= settings.lifeToUsePotion) {
          this.lifeToUsePotion = settings.lifeToUsePotion;
        }
      }
      if (this.potionsMana?.length > 0) {
        this.usePotionsMana = settings.usePotionsMana;
        if (settings.selectedPotionMana?.potion?.id && this.potionsMana.some(potion => potion.potion.id === settings.selectedPotionMana.potion.id)) {
          this.selectedPotionMana = this.potionsMana.find(potion => potion.potion.id === settings.selectedPotionMana.potion.id);
        }
        if (this.character.maxMana >= settings.manaToUsePotion) {
          this.manaToUsePotion = settings.manaToUsePotion;
        }
      }
      if (settings.selectedCreature?.creature?.id > 0) {
        this.selectedCreature = this.creatures.find(creature => creature.creature.id === settings.selectedCreature.creature.id);
      }
    }
  }

  saveLocalStorage() {
    const settings = {
      minLife: this.minLife,
      useSpellHealing: this.useSpellHealing,
      selectedSpellHeal: this.selectedSpellHeal,
      lifeToUseSpell: this.lifeToUseSpell,
      useSpellStrike: this.useSpellStrike,
      selectedSpellStrike: this.selectedSpellStrike,
      manaToUseSpell: this.manaToUseSpell,
      usePotionsHealing: this.usePotionsHealing,
      selectedPotionHealing: this.selectedPotionHealing,
      lifeToUsePotion: this.lifeToUsePotion,
      usePotionsMana: this.usePotionsMana,
      selectedPotionMana: this.selectedPotionMana,
      manaToUsePotion: this.manaToUsePotion,
      selectedCreature: this.selectedCreature
    };
    localStorage.setItem(this.character.name + 'Settings', JSON.stringify(settings));
  }

  startHunt() {
    this.statusHunt = true;

    this.saveLocalStorage();

    if (!this.minLife) {
      this.minLife = 10
    }

    const character = this.character

    this.monster = { ...this.selectedCreature.creature }
    this.monster.maxLife = this.monster.life
    let bestiaryId = this.selectedCreature.id

    this.countMonsterKill = 0;
    let countTimeToKill = 0;

    this.atkInterval = setInterval(() => {
      countTimeToKill += 1;
      let damage = this.getDamage(character, this.monster)
      if (this.character.magicDamage) {
        let manaCost = this.character.slot2Item?.manaRequired
        if (this.character.mana - manaCost >= 0) {
          this.character.mana -= manaCost;
          this.monster.life -= damage.cDamage
        }
      } else {
        this.monster.life -= damage.cDamage
      }
      let statDamage = this.stats.find(stat => stat.label === 'Dano Basico');
      if (statDamage) {
          statDamage.value = damage.cDamage;
      } else {
        this.stats.push({label: 'Dano Basico', value: damage.cDamage})
      }
      if (this.monster.life <= 0) {
        this.monster.life = 0;
      } else {
        if (this.useSpellStrike && this.exaustedSpellStrike == 0) {
          if (this.character.mana >= this.manaToUseSpell && this.character.mana >= this.selectedSpellStrike.manaRequired) {
            this.exaustedPotionHealing = this.exaustedPotionHealing > 0 ? this.exaustedPotionHealing - 1 : 0;
            this.exaustedPotionMana = this.exaustedPotionMana > 0 ? this.exaustedPotionMana - 1 : 0;
            this.exaustedSpellHealing = this.exaustedSpellHealing > 0 ? this.exaustedSpellHealing - 1 : 0;
            this.exaustedSpellStrike = 3;
            let spellDamage = this.getSpellStrikeFormulaValue();
            this.character.mana -= this.selectedSpellStrike.manaRequired
            this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, null, null);
            let statSpellDamage = this.stats.find(stat => stat.label === 'Magia Dano');
            if (statSpellDamage) {
              statSpellDamage.value = spellDamage;
            } else {
              this.stats.push({label: 'Magia Dano', value: spellDamage})
            }
            if (this.monster.life - spellDamage <= 0) {
              this.monster.life = 0;
            } else {
              this.monster.life -= spellDamage
              return;
            }
          }
        }
      }
      if (this.useSpellHealing && this.exaustedSpellHealing == 0 && this.monster.life > 0) {
        if (this.character.life <= this.lifeToUseSpell && this.character.mana >= this.selectedSpellHeal.manaRequired) {
          this.exaustedPotionHealing = this.exaustedPotionHealing > 0 ? this.exaustedPotionHealing - 1 : 0;
          this.exaustedPotionMana = this.exaustedPotionMana > 0 ? this.exaustedPotionMana - 1 : 0;
          this.exaustedSpellStrike = this.exaustedSpellStrike > 0 ? this.exaustedSpellStrike - 1 : 0;
          this.exaustedSpellHealing = 3;
          let healQuantity = this.getHealFormulaValue();
          if (this.character.life + healQuantity <= this.character.maxLife) {
            this.character.life += healQuantity;
          } else {
            this.character.life = this.character.maxLife
          }
          let statSpellHeal = this.stats.find(stat => stat.label === 'Magia Cura');
          if (statSpellHeal) {
            statSpellHeal.value = healQuantity;
          } else {
            this.stats.push({label: 'Magia Cura', value: healQuantity})
          }
          this.character.mana -= this.selectedSpellHeal.manaRequired
          this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, null, null);
          return;
        }
      }
      if (this.usePotionsHealing && this.exaustedPotionHealing == 0 && this.monster.life > 0) {
        if (this.character.life <= this.lifeToUsePotion && this.selectedPotionHealing.quantity > 0) {
          this.exaustedSpellHealing = this.exaustedSpellHealing > 0 ? this.exaustedSpellHealing - 1 : 0;
          this.exaustedPotionMana = this.exaustedPotionMana > 0 ? this.exaustedPotionMana - 1 : 0;
          this.exaustedSpellStrike = this.exaustedSpellStrike > 0 ? this.exaustedSpellStrike - 1 : 0;
          this.exaustedPotionHealing = 3;
          this.selectedPotionHealing.quantity -= 1;
          let healQuantity = Math.round(this.getRandomInRange(this.selectedPotionHealing.potion.min, this.selectedPotionHealing.potion.max))
          if (this.character.life + healQuantity <= this.character.maxLife) {
            this.character.life += healQuantity;
          } else {
            this.character.life = this.character.maxLife
          }
          let statPotionHeal = this.stats.find(stat => stat.label === 'Potion Cura');
          if (statPotionHeal) {
            statPotionHeal.value = healQuantity;
          } else {
            this.stats.push({label: 'Potion Cura', value: healQuantity})
          }
          this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, this.selectedPotionHealing.potion.id, null);
          if (this.selectedPotionHealing.quantity <= 0) {
            this.usePotionsHealing = false;
            this.selectedPotionHealing = null;
            this.potionsHealing = [];
          }
          return;
        }
      }
      if (this.usePotionsMana && this.exaustedPotionMana == 0 && this.monster.life > 0) {
        if (this.character.mana <= this.manaToUsePotion && this.selectedPotionMana.quantity > 0) {
          this.exaustedSpellHealing = this.exaustedSpellHealing > 0 ? this.exaustedSpellHealing - 1 : 0;
          this.exaustedPotionHealing = this.exaustedPotionHealing > 0 ? this.exaustedPotionHealing - 1 : 0;
          this.exaustedSpellStrike = this.exaustedSpellStrike > 0 ? this.exaustedSpellStrike - 1 : 0;
          this.exaustedPotionMana = 3;
          this.selectedPotionMana.quantity -= 1;
          let healQuantity = Math.round(this.getRandomInRange(this.selectedPotionMana.potion.min, this.selectedPotionMana.potion.max))
          if (this.character.mana + healQuantity <= this.character.maxMana) {
            this.character.mana += healQuantity;
          } else {
            this.character.mana = this.character.maxMana
          }
          let statPotionMana = this.stats.find(stat => stat.label === 'Potion Mana');
          if (statPotionMana) {
            statPotionMana.value = healQuantity;
          } else {
            this.stats.push({label: 'Potion Mana', value: healQuantity})
          }
          this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, null, this.selectedPotionMana.potion.id);
          if (this.selectedPotionMana.quantity <= 0) {
            this.usePotionsMana = false;
            this.selectedPotionMana = null;
            this.potionsMana = [];
          }
          return;
        }
      }
      if (this.monster.life > 0) {
        this.exaustedSpellHealing = this.exaustedSpellHealing > 1 ? this.exaustedSpellHealing - 2 : this.exaustedSpellHealing > 0 ? this.exaustedSpellHealing - 1 : 0;
        this.exaustedPotionHealing = this.exaustedPotionHealing > 1 ? this.exaustedPotionHealing - 2 : this.exaustedPotionHealing > 0 ? this.exaustedPotionHealing - 1 : 0;
        this.exaustedPotionMana = this.exaustedPotionMana > 1 ? this.exaustedPotionMana - 2 : this.exaustedPotionMana > 0 ? this.exaustedPotionMana - 1 : 0;
        character.life -= damage.mDamage
        let statDamageTaken = this.stats.find(stat => stat.label === 'Dano Sofrido');
        if (statDamageTaken) {
          statDamageTaken.value = damage.mDamage;
        } else {
          this.stats.push({label: 'Dano Sofrido', value: damage.mDamage})
        }
        if (character.life <= 0) {
          character.life = 0;
          this.statusHunt = false;
          this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, null, null);
          this.characterService.characterDead(this.character.id, this.monster.id);
          clearInterval(this.atkInterval);
          this.service.add({ key: 'tst', severity: 'error', summary: 'Morreu', detail: "Você morreu!" });
          setTimeout(()=> {
            window.location.reload();
          }, 2000);
        } else if (character.life <= this.minLife) {
          this.statusHunt = false;
          this.characterService.updateCharacterLifeManaStaminaByValues(character.id, this.character.life, this.character.mana, null, null);
          clearInterval(this.atkInterval);
        }
      } else {
        this.countMonsterKill += 1
        this.totalExpEarned = this.countMonsterKill*this.monster.experience
        this.avgExpHour = ((this.countMonsterKill*this.monster.experience)/countTimeToKill*3600/1000).toFixed(1) + 'k'
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
        this.characterService.updateCharacter(character.id, null, bestiaryId, this.monster.experience, this.character.life, this.character.mana, ((this.countMonsterKill*this.monster.experience)/countTimeToKill*3600), goldEarned, itemLooted);
        if (character.experience >= this.expNextLevel) {
          this.characterService.increaseLevel(character.id);
          character.level += 1;
          let lifeGain = 5;
          let manaGain = 5;
          if (character.vocationId == 2 || character.vocationId == 6) {
            lifeGain = 15;
          }
          if (character.vocationId == 3 || character.vocationId == 7) {
            lifeGain = 10;
            manaGain = 15;
          }
          if (character.vocationId == 4 || character.vocationId == 5 || character.vocationId == 8 || character.vocationId == 9) {
            manaGain = 30;
          }
          character.maxLife += lifeGain;
          character.maxMana += manaGain;
          character.life = character.maxLife;
          character.mana= character.maxMana;;
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

  calculateTimeToNextLevel(): string {
    // Verifica se expHour é válido para evitar divisão por zero
    let expHour: number = Number(this.avgExpHour.replace('k', '')) * 1000;
    if (expHour <= 0) {
      return undefined;
    }
  
    // Calcula a experiência restante e o tempo em horas
    const expRemaining = this.expNextLevel - this.character.experience;
    const timeInHours = expRemaining / expHour;
  
    // Converte o tempo para horas, minutos e segundos
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours - hours) * 60);
    const seconds = Math.floor((((timeInHours - hours) * 60) - minutes) * 60);
  
    // Retorna o tempo formatado como uma string
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
    } else {
      return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
  }

  getDamage(character:Character, monster:Creature, teste?:boolean) {
    /* (0.085*{D}*{X}*{Y})+({L}/5)
    X = Ataque da arma
    Y = Skills do jogador
    L = Level do jogador
    D = Fator de dano (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
    */

    let characterMaxDamage = 0;
    if (!this.character.magicDamage) {
      let skill = character.slot2Item?.type == 'sword' ? character.sword : character.slot2Item?.type == 'axe' ? character.axe : character.slot2Item?.type == 'club' ? character.club : character.slot2Item?.type == 'distance' ? character.distance : character.slot2Item?.type == 'arrow' ? character.distance : character.slot2Item?.type == 'bolt' ? character.distance : 10
      let factor = this.character.slot2Item?.type === 'distance' || this.character.slot2Item?.type === 'arrow' || this.character.slot2Item?.type === 'bolt' ? 0.090 : 0.085
      characterMaxDamage = Math.round((factor*this.huntStyleSelected.value*character.totalAtk*skill)+(character.level/5)) 
    } else {
      characterMaxDamage = this.character.totalAtk
    }

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
    
    let characterDamage = this.character.magicDamage ? characterMaxDamage : Math.round(this.getRandomInRange(0, characterMaxDamage))
    let monsterDamage = Math.round(this.getRandomInRange(0, monster.maxDamage))

    let characterFinalDamage = this.character.magicDamage ? characterDamage : Math.round(characterDamage-(0*0)/(1*100)-(characterDamage/100)*this.getRandomInRange(monsterMinArmor, monsterMaxArmor))
    let monsterFinalDamage = Math.round(monsterDamage-(character.totalDef*character.shielding)/(this.huntStyleSelected.value*100)-(monsterDamage/100)*this.getRandomInRange(characterMinArmor, characterMaxArmor))

    //danos magicos
    if (monster.damages?.length > 0 && !teste) {
      const extraDamageChance = (monster.damages.length/10) + 0.3; //10% chance de causar dano extra para cada damage extra no array + 30% base
      const randomValue = Math.random();
      let shouldExtraDamage = randomValue <= extraDamageChance;
      if (shouldExtraDamage) {
        let selectedDamageIndex = Math.round(this.getRandomInRange(0, monster.damages.length-1))
        let selectedDamage = monster.damages[selectedDamageIndex]
        let extraDamage = Math.round(this.getRandomInRange(monster.damages[selectedDamageIndex].minDamage, monster.damages[selectedDamageIndex].minDamage))
        if (selectedDamage.type === 'healing') {
          if (this.monster.life + extraDamage <= this.monster.maxLife) {
            this.monster.life += extraDamage
          } else {
            this.monster.life = this.monster.maxLife
          }
        } else if (selectedDamage.type === 'life drain') {
          if (this.character.life - extraDamage >= 0) {
            this.character.life -= extraDamage
          } else {
            this.character.life = 0;
          }
          if (this.monster.life + extraDamage <= this.monster.maxLife) {
            this.monster.life += extraDamage
          } else {
            this.monster.life = this.monster.maxLife
          }
        } else if (selectedDamage.type === 'mana drain') {
          if (this.character.mana - extraDamage >= 0) {
            this.character.mana -= extraDamage
          } else {
            this.character.mana = 0;
          }
        } else {
          monsterFinalDamage += extraDamage
        }
      }

      
    }
    return {cDamage: characterFinalDamage >=0 ? characterFinalDamage : 0, mDamage: monsterFinalDamage >=0 ? monsterFinalDamage : 0}
  }

  getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  shouldDrop(rarity: string): boolean {
    const dropChance = rarity === 'comum' ? 0.15 : rarity === 'incomum' ? 0.09 : rarity === 'raro' ? 0.02 : 0.005
    const randomValue = Math.random();
    return randomValue <= dropChance;
  }

  getHealFormulaValue() {
    if (this.selectedSpellHeal.spell === 'exura ico') {
      // Cura máxima: (lvl*0.2)+(mlvl*7.95)+51
      // Cura mínima: (lvl*0.2)+(mlvl*4)+25
      return Math.round(this.getRandomInRange((this.character.level*0.2)+(this.character.magicLevel*4)+25, (this.character.level*0.2)+(this.character.magicLevel*7.95)+51))
    }
    if (this.selectedSpellHeal.spell === 'exura') {
      // Cura máxima: (lvl*0.2)+(mlvl*1.795)+11
      // Cura mínima: (lvl*0.2)+(mlvl*1.4)+8
      return Math.round(this.getRandomInRange((this.character.level*0.2)+(this.character.magicLevel*1.4)+8, (this.character.level*0.2)+(this.character.magicLevel*1.795)+11))
    }
    return 0
  }

  getSpellStrikeFormulaValue() {
    if (this.selectedSpellStrike.spell === 'exori san') {
      // Dano máximo: (lvl*0.2)+(mlvl*3)+18
      // Dano mínimo: (lvl*0.2)+(mlvl*1.79)+11
      return Math.round(this.getRandomInRange((this.character.level*0.2)+(this.character.magicLevel*1.79)+11, (this.character.level*0.2)+(this.character.magicLevel*3)+18))
    } else if (this.selectedSpellStrike.spell === 'exori ico') {
      // Dano máximo: (lvl*0.2)+(1.1*(skill+atk))
      // Dano mínimo: (lvl*0.2)+(0.5*(skill+atk))
      let skill = this.character.slot2Item?.type == 'sword' ? this.character.sword : this.character.slot2Item?.type == 'axe' ? this.character.axe : this.character.slot2Item?.type == 'club' ? this.character.club : this.character.slot2Item?.type == 'distance' ? this.character.distance : this.character.slot2Item?.type == 'arrow' ? this.character.distance : this.character.slot2Item?.type == 'bolt' ? this.character.distance : 10
      return Math.round(this.getRandomInRange((this.character.level*0.2)+(0.5*(skill+this.character.totalAtk)), (this.character.level*0.2)+(1.1*(skill+this.character.totalAtk))))
    } else {
      // Dano máximo: (lvl*0.2)+(mlvl*2.203)+13
      // Dano mínimo: (lvl*0.2)+(mlvl*1.403)+8
      return Math.round(this.getRandomInRange((this.character.level*0.2)+(this.character.magicLevel*1.403)+8, (this.character.level*0.2)+(this.character.magicLevel*2.203)+13))
    }
    return 0
  }

  getDifferenceFromNowInSeconds(dateString: any): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = Math.abs(now.getTime() - date.getTime());
    return Math.floor(diffInMs / 1000);
  }

  formatTime(seconds: number): string {
    if (seconds < 0) {
      return "Conluído";
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

}
