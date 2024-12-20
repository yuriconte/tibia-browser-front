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
import { Item } from 'src/app/model/item.model';
import { CombatUtil } from 'src/app/utils/combat.utils';

@Component({
  selector: 'app-hunt-v2',
  templateUrl: './hunt-v2.component.html',
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
    
    .progress-container {
      position: relative;
      width: 100%;
    }

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

    .status-icons {
        position: absolute;
        bottom: 1px;
        right: 5px;
        display: flex;
        gap: 5px; 
    }

    .status-icon {
        width: 12px; 
        height: 12px;
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

    ::ng-deep .p-card .p-card-content {
      padding: 0;
      height: 143px;
    }

    ::ng-deep .equip .p-card .p-card-body .p-card-content {
      padding: 0;
      height: 40px;
      text-align: center;
    }

    ::ng-deep .creature .p-card .p-card-body .p-card-content {
      padding: 0;
      height: 80px;
      text-align: center;
    }

    ::ng-deep .equip .p-card, ::ng-deep .creature .p-card {
      background: #283443;
      transition: background 1s ease-in-out; /* Define a transição */
    }   

    ::ng-deep .equip.highlight .p-card {
      background: #4ade80;
    }

    ::ng-deep .creature .p-card .p-card-title {
      font-family: 'Martel';
      font-size: 1rem;
      font-weight: 100;
      text-align: left;
      height: 30px;
      align-content: center;
    }

    ::ng-deep .p-card .p-card-footer {
      padding: 0;
      padding-top: 1rem;  
    }

    .effect {
      position: absolute;
      top: 40px;
      right: 20px;
    }

    ::ng-deep .status-bar .p-progressbar {
      height: 15px;
    }

    .progress-text-2 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      color: white;
      font-size: 10px;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    }

    ::ng-deep .p-tag-value {
      color: white;
      font-weight: 100;
    }

    ::ng-deep .p-dialog .p-dialog-content {
      padding: 1rem;
    }

    ::ng-deep .p-badge.p-badge-lg {
      color: white
    }

    .image-container {
      position: relative;
      display: inline-block;
    }

    .badge-overlay {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      z-index: 10;
    }

    .badge-overlay-creatures {
      position: absolute;
      top: 20px;
      right: 60px;
      transform: translate(50%, -50%);
      z-index: 10;
    }

    .badge-overlay-loot {
      top: -110px;
      right: 5px;
      transform: translate(50%, -50%);
      z-index: 10;
    }

    ::ng-deep .p-overlay-badge .p-badge {
      right: -40px;
      color: white;
      font-weight: 100
    }

    :host ::ng-deep .p-accordion-tab:not(.p-accordion-tab-active) .p-toggleable-content {
      height: 0;
      overflow: hidden;
    }

    :host ::ng-deep .p-accordion-tab.p-accordion-tab-active .p-toggleable-content {
      height: auto !important;
      overflow: auto !important;
    }

    ::ng-deep .p-button {
      color: white
    }

    ::ng-deep .badge-death .p-badge, ::ng-deep .tag-death .p-tag {
      background-color: #171717; /* Cinza Escuro */
      color: #fff;
    }

    ::ng-deep .badge-fire .p-badge, ::ng-deep .tag-fire .p-tag {
      background-color: #ef4444; /* Vermelho */
      color: #fff;
    }

    ::ng-deep .badge-ice .p-badge, ::ng-deep .tag-ice .p-tag {
      background-color: #60a5fa; /* Azul Claro */
      color: #fff;
    }

    ::ng-deep .badge-holy .p-badge, ::ng-deep .tag-holy .p-tag {
      background-color: #facc15; /* Amarelo */
      color: #000;
    }

    ::ng-deep .badge-energy .p-badge, ::ng-deep .tag-energy .p-tag {
      background-color: #553bf6; /* Roxo */
      color: #fff;
    }

    ::ng-deep .badge-earth .p-badge, ::ng-deep .tag-earth .p-tag {
      background-color: #22c55e; /* Verde */
      color: #fff;
    }

    ::ng-deep .badge-physical .p-badge, ::ng-deep .tag-physical .p-tag {
      background-color: #a3a3a3; /* Cinza Médio */
      color: #fff;
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

  `],
  providers: [MessageService]
})
export class HuntV2Component {
  msgs: Message[] = [];

  loading: boolean = false;

  selectedCreatures: Bestiary[] = []
  monsters: Creature[] = []
  showCreatureIndex: number = 0;
  showCreature: boolean = false;
  showCharacterDetail: boolean = false;
  showItemDetailSelected: Item;
  showItemDetail: boolean = false;
  selectedSkillLabel: string = '';
  selectedSkillValue: number = 10;
  selectedSkillBonusValue: number = 0;
  selectedSkillValueShielding: number = 0;
  activeAccordionIndex = 0;
  responsiveCreaturesOptions: any[];

  highlightPotionLife: boolean;
  highlightPotionMana: boolean;
  highlightSpellLife: boolean;
  highlightSpellAttack: boolean;
  highlightRune: boolean;

  highlightCharacterDeath: boolean;
  highlightCharacterHoly: boolean;
  highlightCharacterFire: boolean;
  highlightCharacterIce: boolean;
  highlightCharacterEnergy: boolean;
  highlightCharacterEarth: boolean;
  highlightCharacterPhysical: boolean;
  highlightCharacterDrain: boolean;
  highlightCharacterBlock: boolean;
  highlightCharacterHeal: boolean;
  highlightCharacterPoison: boolean;

  highlightCreatureDeath: boolean[] = [false, false, false, false, false];
  highlightCreatureHoly: boolean[] = [false, false, false, false, false];
  highlightCreatureFire: boolean[] = [false, false, false, false, false];
  highlightCreatureIce: boolean[] = [false, false, false, false, false];
  highlightCreatureEnergy: boolean[] = [false, false, false, false, false];
  highlightCreatureEarth: boolean[] = [false, false, false, false, false];
  highlightCreaturePhysical: boolean[] = [false, false, false, false, false];
  highlightCreatureDrain: boolean[] = [false, false, false, false, false];
  highlightCreatureBlock: boolean[] = [false, false, false, false, false];
  highlightCreatureHeal: boolean[] = [false, false, false, false, false];

  highlightCreatureMasFlam: boolean[] = [false, false, false, false, false];
  highlightCreatureMasFrigo: boolean[] = [false, false, false, false, false];
  highlightCreatureMasVis: boolean[] = [false, false, false, false, false];
  highlightCreatureMasTera: boolean[] = [false, false, false, false, false];
  highlightCreatureMasSan: boolean[] = [false, false, false, false, false];

  creaturesPositions: number[] = [0, 1, 2, 3, 4];

  creatures: Bestiary[] = [];
  creaturesAll: Bestiary[] = [];

  character: Character = new Character;
  
  huntStyle: any[] = [];
  huntStyleSelected: any;
  
  huntType: any[] = [];
  huntTypeSelected: any;

  arenaType: any[] = [];
  arenaTypeSelected: any;

  bossType: any[] = [];
  bossTypeSelected: any;

  statusHunt: boolean = false;
  
  characterAtkInterval;
  lifeInterval;
  manaInterval;
  creatureAtkIntervals: any[] = [];
  characterHealingIntervals: any[] = [];
  poisonInterval;
  poisonTicks: number = 0;
  burnInterval;
  burnTicks: number = 0;
  curseInterval;
  curseTicks: number = 0;
  bonusLifeManaInterval;
  
  countMonsterKill: number[] = [0];
  totalExpEarned: number = 0;
  totalGoldEarned: number = 0;
  multiAvgExpHour: string[] = ["0"];
  avgExpHour: string = "0";
  expNextLevel:number = 0;
  expPreviousLevel:number = 0;

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
    this.loading = true;
    this.responsiveCreaturesOptions = [
      {
          breakpoint: '1199px',
          numVisible: 5,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 2,
          numScroll: 1
      }
    ];

    this.huntStyle = [
      { name: 'Ataque', value: 1 },
      { name: 'Balanceado', value: 0.75 },
      { name: 'Defesa', value: 0.5 }
    ];
    this.huntStyleSelected = this.huntStyle[0];

    this.huntType = [
      { name: 'Caçar', value: 1 },
      { name: 'Arena', value: 2 },
      { name: 'Boss', value: 3 },
    ];
    this.huntTypeSelected = this.huntType[0];

    this.arenaType = [
      { name: 'Greenhorn', value: 1, cost: 1000 },
      { name: 'Scrapper', value: 2, cost: 5000 },
      { name: 'Warlord', value: 3, cost: 10000 },
    ];
    this.arenaTypeSelected = this.arenaType[0];

    this.bossType = [
      { name: 'Diário', value: 1 },
      { name: 'Invasão', value: 2 },
      { name: 'Mundial', value: 3 },
    ];
    this.bossTypeSelected = this.bossType[0];

    this.loadCharacter();
  }

  ngOnDestroy() {
    this.cancelIntervals();
  }

  cancelIntervals() {
    if (this.characterAtkInterval) {
      clearInterval(this.characterAtkInterval);
    }
    if (this.lifeInterval) {
      clearInterval(this.lifeInterval);
    }
    if (this.bonusLifeManaInterval) {
      clearInterval(this.bonusLifeManaInterval);
    }
    if (this.manaInterval) {
      clearInterval(this.manaInterval);
    }
    if (this.poisonInterval) {
      clearInterval(this.poisonInterval);
    }
    if (this.burnInterval) {
      clearInterval(this.burnInterval);
    }
    if (this.curseInterval) {
      clearInterval(this.curseInterval);
    }
    if (this.creatureAtkIntervals?.length > 0) {
      for (let interval of this.creatureAtkIntervals) {
        clearInterval(interval);
      }
      this.creatureAtkIntervals = [];
    }
    if (this.characterHealingIntervals?.length > 0) {
      for (let interval of this.characterHealingIntervals) {
        clearInterval(interval);
      }
      this.characterHealingIntervals = [];
    }
  }

  showEquipDetail(item: Item) {
    this.showItemDetailSelected = item
    this.showItemDetail = true;
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data

            if (this.character.slot2Item) {
              switch(this.character.slot2Item.type) {
                case 'sword':
                  this.selectedSkillLabel = 'Sword Fighting'
                  this.selectedSkillValue = this.character.sword;
                  this.selectedSkillBonusValue = CombatUtil.getCharacterSkill(this.character) - this.selectedSkillValue
                  break;
                case 'axe':
                    this.selectedSkillLabel = 'Axe Fighting'
                    this.selectedSkillValue = this.character.axe;    
                    this.selectedSkillBonusValue = CombatUtil.getCharacterSkill(this.character) - this.selectedSkillValue
                    break;
                case 'club':
                  this.selectedSkillLabel = 'Club Fighting'
                  this.selectedSkillValue = this.character.club;   
                  this.selectedSkillBonusValue = CombatUtil.getCharacterSkill(this.character) - this.selectedSkillValue 
                  break;
                case 'distance':
                case 'bolt':
                case 'arrow':
                  this.selectedSkillLabel = 'Distance Fighting'
                  this.selectedSkillValue = this.character.distance;    
                  this.selectedSkillBonusValue = CombatUtil.getCharacterSkill(this.character) - this.selectedSkillValue
                  break;
                case 'rod':
                case 'wand':
                  this.selectedSkillLabel = 'Magic Level'
                  this.selectedSkillValue = this.character.magicLevel;
                  this.selectedSkillBonusValue = CombatUtil.getCharacterTotalMagicLevel(this.character) - this.selectedSkillValue
                  break;
              }
            } else {
              this.selectedSkillLabel = 'Arma não equipada'
              this.selectedSkillValue = 10;
            }

            this.selectedSkillValueShielding = CombatUtil.getCharacterTotalShielding(this.character) - this.character.shielding
            
            if (this.character.arena1 === 1) {
              this.arenaType[0].disabled = true
              this.arenaTypeSelected = this.arenaType[1]
            }
            if (this.character.arena2 === 1) {
              this.arenaType[1].disabled = true
              if (this.character.arena1 === 1) {
                this.arenaTypeSelected = this.arenaType[2]
              } else {
                this.arenaTypeSelected = this.arenaType[0]
              }
            }
            if (this.character.arena3 === 1) {
              this.arenaType[2].disabled = true
              if (this.character.arena1 === 1) {
                this.arenaTypeSelected = this.arenaType[2]
              } else {
                this.arenaTypeSelected = this.arenaType[0]
              }
            }
            if (this.character.arena1 === 1 && this.character.arena2 === 1 && this.character.arena3 === 1) {
              this.huntType[1].disabled = true
            }

            if (this.character.level >= 8 && this.character.vocationId > 1) {
              this.loadSpellsHeal();
              this.loadSpellsAttack();
            }

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
              this.potionsHealing = this.character.potions?.filter(cpot => cpot.potion.type === 'life' || cpot.potion.type === 'life_mana');
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
            }, this.character.vocationId === 2 ? 3000 : this.character.vocationId === 6 ? 2000 :
                this.character.vocationId === 3 ? 4000 : this.character.vocationId === 7 ? 3000 :
                  12000);

            this.manaInterval = setInterval(() => {
              if (this.character.mana < this.character.maxMana) {
                this.character.mana += 2
              }
            }, this.character.vocationId === 2 || this.character.vocationId === 6 ? 3000 :
                this.character.vocationId === 3 ? 2000 : this.character.vocationId === 7 ? 1500 :
                this.character.vocationId === 4 || this.character.vocationId === 5 ? 1500 : 1000);
            
            this.bonusLifeManaInterval = setInterval(() => {
              let quantityLife = CombatUtil.getCharacterBonusHealLife(this.character)
              if (this.character.life + quantityLife < this.character.maxLife) {
                this.character.life += quantityLife
              } else {
                this.character.life = this.character.maxLife
              }
              let quantityMana = CombatUtil.getCharacterBonusHealMana(this.character)
              if (this.character.mana + quantityMana < this.character.maxMana) {
                this.character.mana += quantityMana
              } else {
                this.character.mana = this.character.maxMana
              }
            }, 2000);

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

  changeHuntType(event: any): void {
    if (!event.value) {
      this.huntTypeSelected = this.huntType[0];
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 1)] 
      this.selectedCreatures[0] = this.creatures[0];
      this.creaturesPositions = [0, 1, 2, 3, 4];
      this.prepareCreatures();
      return;
    }
    if (event.value.value == 1) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 1)] 
      this.creaturesPositions = [0, 1, 2, 3, 4];
      this.prepareCreatures();
    } else if (event.value.value == 2) {
      this.creaturesPositions = [0];
      if (this.character.arena1 === 1) {
        this.arenaTypeSelected = this.arenaType[1]
        this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 2)] 
      } else {
        this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 1)] 
      }
      if (this.character.arena2 === 1) {
        if (this.character.arena1 === 1) {
          this.arenaTypeSelected = this.arenaType[2]
          this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 3)] 
        } else {
          this.arenaTypeSelected = this.arenaType[0]
          this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 1)] 
        }
      }
      if (this.character.arena3 === 1) {
        if (this.character.arena1 === 1) {
          this.arenaTypeSelected = this.arenaType[1]
          this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 2)] 
        } else {
          this.arenaTypeSelected = this.arenaType[0]
          this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 1)] 
        }
      }      
      this.creatures.map((creature, index) => {
        creature.disabled = true
        creature.creature.maxLife = creature.creature.life
      });
    } else if (event.value.value == 3) {
      this.creaturesPositions = [0];
      this.bossTypeSelected = this.bossType[0]
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 3 && creature.creature.bossType === 1)] 
    }
    this.selectedCreatures[0] = this.creatures[0];
  }

  changeArenaType(event: any): void {
    if (!event.value) {
      this.arenaTypeSelected = this.arenaType[0];
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 1)] 
      this.creatures.map((creature, index) => {
        creature.disabled = true
        creature.creature.maxLife = creature.creature.life
      });
      this.selectedCreatures[0] = this.creatures[0];
      return;
    }
    if (event.value.value == 1) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 1)] 
    } else if (event.value.value == 2) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 2)] 
    } else if (event.value.value == 3) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 2 && creature.creature.arenaType === 3)] 
    }
    this.creatures.map((creature, index) => {
      creature.disabled = true
      creature.creature.maxLife = creature.creature.life
    });
    this.selectedCreatures[0] = this.creatures[0];
  }

  changeBossType(event: any): void {
    if (!event.value) {
      this.bossTypeSelected = this.bossType[0];
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 3 && creature.creature.bossType === 1)] 
      this.selectedCreatures[0] = this.creatures[0];
      return;
    }
    if (event.value.value == 1) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 3 && creature.creature.bossType === 1)] 
    } else if (event.value.value == 2) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 3 && creature.creature.bossType === 2)] 
    } else if (event.value.value == 3) {
      this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 3 && creature.creature.bossType === 3)] 
    }
    this.selectedCreatures[0] = this.creatures[0];
  }

  loadBestiary() {
    this.bestiaryService.getAll().subscribe({
      next: (data) => {
        this.creaturesAll = data || []
        this.creatures = [...this.creaturesAll.filter(creature => creature.creature.type === 1)] 
        this.selectedCreatures[0] = this.creatures[0];
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

  loadSpellsAttack() {
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
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
      }
    });
  }

  prepareCreatures() {
    this.creatures.map((creature, index) => {
      if (creature.id > 0) {
        creature.creature.maxLife = creature.creature.life
        let expHour = this.character.bestiary?.find(b => b.bestiaryId === this.creatures[index].id)?.expHour || 0;
        creature.creature.expHour = expHour > 0 ? (expHour > 1000000 ? (expHour/1000000).toFixed(1) + 'kk' : expHour > 1000 ? (expHour/1000).toFixed(1) + 'k' : expHour.toFixed(1)) : null
        creature.creature.items.sort((itemA, itemB) => {
          const rateOrder = { comum: 1, incomum: 2, raro: 3, ultra: 4 };
          const rateComparison = rateOrder[itemA.rate] - rateOrder[itemB.rate];
          if (rateComparison === 0) {
            return itemA.item.gold - itemB.item.gold;
          }
          return rateComparison;
        });
      }
    });
    setTimeout(()=> {
      this.loadLocalStorage();
    }, 1000)
  }

  calculateExpLevelFormula(x: number): number {
    x += 1;
    return (50 * Math.pow(x - 1, 3) - 150 * Math.pow(x - 1, 2) + 400 * (x - 1)) / 3;
  }

  cancelHunt() {
    this.statusHunt = false;
    clearInterval(this.characterAtkInterval);
    if (this.creatureAtkIntervals?.length > 0) {
      for (let interval of this.creatureAtkIntervals) {
        clearInterval(interval);
      }
      this.creatureAtkIntervals = [];
    }
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
      if (settings.selectedCreatures?.length > 0) {
        this.selectedCreatures = [];
        for (let creature of settings.selectedCreatures) {
          this.selectedCreatures.push(this.creatures?.find(c => c.creature.id === creature.creature.id))
        }
      }
    }
    this.loading = false;
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
      selectedCreatures: this.selectedCreatures
    };
    localStorage.setItem(this.character.name + 'Settings', JSON.stringify(settings));
  }

  startHunt() {
    this.statusHunt = true;
    this.avgExpHour = '0'
    this.lootDrop = [];
    this.totalGoldEarned = 0;
    this.totalExpEarned = 0;

    if (!this.minLife) {
      this.minLife = 10
    }

    let ticks = -2;
    this.countMonsterKill = [];
    this.monsters = [];
    this.totalExpEarned = 0;
    this.creatureAtkIntervals = [];
    this.characterHealingIntervals = [];

    this.exaustedSpellHealing = 0;
    this.exaustedPotionHealing = 0;
    this.exaustedPotionMana = 0;

    if (this.useSpellHealing) {
      this.characterHealingIntervals.push(setInterval(() => {
          if (this.exaustedSpellHealing == 0) {
            if (this.character.life <= this.lifeToUseSpell && this.character.mana >= this.selectedSpellHeal.manaRequired) {
              this.highlightSpellLife = true;
              setTimeout(() => {
                this.highlightSpellLife = false;
              }, 500)
              this.exaustedSpellHealing = this.selectedSpellHeal.exaustedTime || 1;
              let healQuantity = this.getHealFormulaValue();
              if (this.character.life + healQuantity <= this.character.maxLife) {
                this.character.life += healQuantity;
              } else {
                this.character.life = this.character.maxLife
              }
              this.character.mana -= this.selectedSpellHeal.manaRequired
              this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, null);
              return;
            }
          }
          this.exaustedSpellHealing = this.exaustedSpellHealing > 0 ? this.exaustedSpellHealing - 1 : 0;
        }, 1000)
      );
    }

    if (this.usePotionsHealing) {
      setTimeout(() => {
        this.characterHealingIntervals.push(setInterval(() => {
            if (this.exaustedPotionHealing == 0) {
              if (this.character.life <= this.lifeToUsePotion && this.selectedPotionHealing.quantity > 0) {
                this.highlightPotionLife = true;
                setTimeout(() => {
                  this.highlightPotionLife = false;
                }, 500)
                this.exaustedPotionHealing = 1;
                this.selectedPotionHealing.quantity -= 1;
                let healQuantity = CombatUtil.getRoundedRandomInRange(this.selectedPotionHealing.potion.min, this.selectedPotionHealing.potion.max)
                if (this.character.life + healQuantity <= this.character.maxLife) {
                  this.character.life += healQuantity;
                } else {
                  this.character.life = this.character.maxLife
                }
                //spirit potion, heala mana metade do que heala vida
                if (this.selectedPotionHealing.potion.type === 'life_mana') {
                  let healQuantity = CombatUtil.getRoundedRandomInRange(this.selectedPotionHealing.potion.min/2, this.selectedPotionHealing.potion.max/2)
                  if (this.character.mana + healQuantity <= this.character.maxMana) {
                    this.character.mana += healQuantity;
                  } else {
                    this.character.mana = this.character.maxMana
                  }
                }
                this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, this.selectedPotionHealing.potion.id, null);
                if (this.selectedPotionHealing.quantity <= 0) {
                  this.usePotionsHealing = false;
                  this.selectedPotionHealing = null;
                  this.potionsHealing = [];
    
                }
                return;
              }
            }
            this.exaustedPotionHealing = this.exaustedPotionHealing > 0 ? this.exaustedPotionHealing - 1 : 0;
          }, 1000)
        );
      }, 750);
    }

    if (this.usePotionsMana) {
      setTimeout(() => {
        this.characterHealingIntervals.push(setInterval(() => {
            if (this.exaustedPotionMana == 0) {
              if (this.character.mana <= this.manaToUsePotion && this.selectedPotionMana.quantity > 0) {
                this.highlightPotionMana = true;
                setTimeout(() => {
                  this.highlightPotionMana = false;
                }, 500)
                this.exaustedPotionMana = 1;
                this.selectedPotionMana.quantity -= 1;
                let healQuantity = CombatUtil.getRoundedRandomInRange(this.selectedPotionMana.potion.min, this.selectedPotionMana.potion.max)
                if (this.character.mana + healQuantity <= this.character.maxMana) {
                  this.character.mana += healQuantity;
                } else {
                  this.character.mana = this.character.maxMana
                }
                this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, this.selectedPotionMana.potion.id);
                if (this.selectedPotionMana.quantity <= 0) {
                  this.usePotionsMana = false;
                  this.selectedPotionMana = null;
                  this.potionsMana = [];
                }
                return;
              }
            }
            this.exaustedPotionMana = this.exaustedPotionMana > 0 ? this.exaustedPotionMana - 1 : 0;
          }, 1000)
        );
      }, 1500);
    }
    
    this.characterAtkInterval = setInterval(() => {
      ticks += 2
      for (const index in this.selectedCreatures) {
        let creature = this.selectedCreatures[index];
        if (creature) {
          if (this.monsters[index]) {
            if (this.monsters[index]?.life <= 0) {
              this.monsters[index] = {...creature.creature}
              this.monsters[index].maxLife = this.monsters[index].life
              this.countMonsterKill[index]++
              this.totalExpEarned += this.monsters[index].experience
              this.avgExpHour = (this.totalExpEarned/ticks*3600/1000).toFixed(1) + 'k'

              let expCreature = 0;
              let indexes = this.monsters.map((m, i) => (m.id === this.monsters[index].id ? i : -1)).filter(i => i !== -1);
              for (let i of indexes) {
                expCreature += this.countMonsterKill[i]*this.monsters[i].experience
              }

              this.selectedCreatures[index].creature.expHour = ((expCreature)/ticks*3600/1000).toFixed(1) + 'k'
              this.character.experience += this.monsters[index].experience;
              let goldEarned = CombatUtil.getRoundedRandomInRange(this.monsters[index].minGold, this.monsters[index].maxGold);
              this.totalGoldEarned += goldEarned;
              let itemLooted: number[] = [];
              if (this.monsters[index].items) {
                this.monsters[index].items.forEach(item => {
                  let drop = this.shouldDrop(item.rate)
                  if (drop) {
                    let characterItem: CharacterItem = {characterId: this.character.id, item: item.item, quantity: 1}
                    if (this.lootDrop) {
                      const existingItem = this.lootDrop.find(
                        (dropItem: CharacterItem) => dropItem.item.id === item.item.id
                      );            
                      if (existingItem) {
                        existingItem.quantity += 1;
                        existingItem.item.gold = existingItem.item.gold*existingItem.quantity
                      } else {
                        this.lootDrop.push(characterItem);
                      }
                    } else {
                      this.lootDrop = [characterItem];
                    }
                    itemLooted.push(item.item.id)
                    //this.service.add({ key: 'tst', severity: 'success', summary: 'Drop', detail: "Dropou um " + item.item.name });
                  }
                })
              }
              if (this.huntTypeSelected?.value == 2 && this.countMonsterKill[index] <= 1) {
                goldEarned = this.arenaTypeSelected.cost*-1
                this.character.balance += goldEarned
              }
              let arenaId = null;
              if (this.huntTypeSelected?.value == 2) {
                if (this.countMonsterKill[index] === 10) {
                  arenaId = this.arenaTypeSelected.value
                  switch (this.arenaTypeSelected.value) {
                    case 1:
                      itemLooted.push(225)
                      itemLooted.push(226)
                      itemLooted.push(227)
                      break;
                    case 2:
                      itemLooted.push(230)
                      itemLooted.push(231)
                      itemLooted.push(232)
                      break;
                    case 3:
                      itemLooted.push(233)
                      itemLooted.push(234)
                      itemLooted.push(235)
                      break;
                  }
                }
              }
              this.characterService.updateCharacter(this.character.id, null, this.selectedCreatures[index].id, this.monsters[index].experience, this.character.life, this.character.mana, ((this.countMonsterKill[index]*this.monsters[index].experience)/ticks*3600), goldEarned, itemLooted, arenaId);
              if (this.character.experience >= this.expNextLevel) {
                this.characterService.increaseLevel(this.character.id);
                this.character.level += 1;
                let lifeGain = 5;
                let manaGain = 5;
                if (this.character.vocationId == 2 || this.character.vocationId == 6) {
                  lifeGain = 15;
                }
                if (this.character.vocationId == 3 || this.character.vocationId == 7) {
                  lifeGain = 10;
                  manaGain = 15;
                }
                if (this.character.vocationId == 4 || this.character.vocationId == 5 || this.character.vocationId == 8 || this.character.vocationId == 9) {
                  manaGain = 30;
                }
                this.character.maxLife += lifeGain;
                this.character.maxMana += manaGain;
                this.character.life = this.character.maxLife;
                this.character.mana = this.character.maxMana;;
                this.expNextLevel = this.calculateExpLevelFormula(this.character.level)
                this.expPreviousLevel = this.calculateExpLevelFormula(this.character.level-1)
                if (this.character.level >= 8 && this.character.vocationId === 1 && this.msgs.length == 0) {
                  this.msgs = [];
                  this.msgs.push({ severity: 'info', summary: 'Level 8', detail: "Escolha uma vocação no seu perfil: Knight, Paladin, Druid, Sorcerer" });
                }
              }
              if (this.huntTypeSelected?.value == 2) {
                if (this.countMonsterKill[index] === 10) {
                  this.countMonsterKill[index] = 9
                  this.service.add({ key: "tst", severity: 'success', summary: 'Sucesso', detail: "Arena concluída! Recompensa enviada para o seu depot" });
                  this.statusHunt = false;
                  this.cancelIntervals();
                  setTimeout(()=> {
                    window.location.reload();
                  }, 2000);
                }
              }
            }
          } else {
            this.monsters.push({...creature.creature})
            this.monsters[index].maxLife = this.monsters[index].life
            this.countMonsterKill.push(0);
            setTimeout(() => {
              this.creatureAtkIntervals.push(
                setInterval(() => {
                  if (this.monsters[index].life > 0) {
                    let creatureDamage = CombatUtil.getRoundedRandomInRange(this.monsters[index].minDamage, this.monsters[index].maxDamage)
                    let damageReduction = CombatUtil.getCharacterResistence(this.character, 'physical')
                    let damageTaken = CombatUtil.takeDamage(creatureDamage, CombatUtil.getCharacterTotalDefense(this.character), CombatUtil.getCharacterTotalShielding(this.character), CombatUtil.getCharacterTotalArmor(this.character), damageReduction);
                    this.character.life -= damageTaken
                    if (damageTaken > 0) {
                      this.highlightCharacterPhysical = true;
                      setTimeout(() => {
                        this.highlightCharacterPhysical = false;
                      }, 800)
                    } else {
                      this.highlightCharacterBlock = true;
                      setTimeout(() => {
                        this.highlightCharacterBlock = false;
                      }, 800)
                    }
                    let creatureSpell = CombatUtil.getRandomCreatureSpell(this.monsters[index]);
                    if (creatureSpell) {
                      let extraDamage = CombatUtil.getRoundedRandomInRange(creatureSpell.minDamage, creatureSpell.maxDamage)
                      if (creatureSpell.type === 'healing') {
                        if (this.monsters[index].life + extraDamage <= this.monsters[index].maxLife) {
                          this.monsters[index].life += extraDamage
                        } else {
                          this.monsters[index].life = this.monsters[index].maxLife
                        }
                        this.highlightCreatureHeal[0] = true;
                        setTimeout(() => {
                          this.highlightCreatureHeal[0] = false;
                        }, 800)
                      } else if (creatureSpell.type === 'life drain') {
                        if (this.character.life - extraDamage >= 0) {
                          this.character.life -= extraDamage
                        } else {
                          this.character.life = 0;
                        }
                        if (this.monsters[index].life + extraDamage <= this.monsters[index].maxLife) {
                          this.monsters[index].life += extraDamage
                        } else {
                          this.monsters[index].life = this.monsters[index].maxLife
                        }
                        this.highlightCreatureHeal[0] = true;
                        setTimeout(() => {
                          this.highlightCreatureHeal[0] = false;
                        }, 800)
                      } else if (creatureSpell.type === 'mana drain') {
                        if (this.character.mana - extraDamage >= 0) {
                          this.character.mana -= extraDamage
                        } else {
                          this.character.mana = 0;
                        }
                        this.highlightCreatureHeal[0] = true;
                        setTimeout(() => {
                          this.highlightCreatureHeal[0] = false;
                        }, 800)
                      } else if (creatureSpell.type === 'poison') {
                        this.poisonInterval = setInterval(() => {
                          this.poisonTicks = creatureSpell.ticks || 6
                          if (this.poisonTicks > 0) {
                            let extraDamageReduction = CombatUtil.getCharacterResistence(this.character, 'earth')
                            this.character.life -= CombatUtil.takeDamage(extraDamage, 0, 0,0, extraDamageReduction);
                            this.poisonTicks -= 1;
                            this.highlightCharacterPoison = true;
                            setTimeout(() => {
                              this.highlightCharacterPoison = false;
                            }, 800)
                          } else {
                            this.poisonInterval = null
                            clearInterval(this.poisonInterval)
                          }
                        }, 2000)
                      } else if (creatureSpell.type === 'burning') {
                        this.burnTicks = creatureSpell.ticks || 6
                        this.burnInterval = setInterval(() => {
                          if (this.burnTicks > 0) {
                            let extraDamageReduction = CombatUtil.getCharacterResistence(this.character, 'fire')
                            this.character.life -= CombatUtil.takeDamage(extraDamage, 0, 0,0, extraDamageReduction);
                            this.burnTicks -= 1;
                            this.highlightCharacterFire = true;
                            setTimeout(() => {
                              this.highlightCharacterFire = false;
                            }, 800)
                          } else {
                            this.burnInterval = null
                            clearInterval(this.burnInterval)
                          }
                        }, 2000)
                      } else if (creatureSpell.type === 'cursed') {
                        this.curseTicks = creatureSpell.ticks || 6
                        this.curseInterval = setInterval(() => {
                          if (this.curseTicks > 0) {
                            let extraDamageReduction = CombatUtil.getCharacterResistence(this.character, 'death')
                            this.character.life -= CombatUtil.takeDamage(extraDamage, 0, 0,0, extraDamageReduction);
                            this.curseTicks -= 1;
                            this.highlightCharacterDeath = true;
                            setTimeout(() => {
                              this.highlightCharacterDeath = false;
                            }, 800)
                          } else {
                            this.curseInterval = null
                            clearInterval(this.curseInterval)
                          }
                        }, 2000)
                      } else {
                        let extraDamageReduction = CombatUtil.getCharacterResistence(this.character, creatureSpell.type)
                        this.character.life -= CombatUtil.takeDamage(extraDamage, CombatUtil.getCharacterTotalDefense(this.character), CombatUtil.getCharacterTotalShielding(this.character), CombatUtil.getCharacterTotalArmor(this.character), extraDamageReduction);
                      }
                    }
                    if (this.character.life <= 0) {
                      this.character.life = 0;
                      this.statusHunt = false;
                      this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, null);
                      this.characterService.characterDead(this.character.id, this.monsters[index].id);
                      this.cancelIntervals();
                      this.service.add({ key: 'tst', severity: 'error', summary: 'Morreu', detail: "Você morreu!" });
                      setTimeout(()=> {
                        window.location.reload();
                      }, 2000);
                    } else if (this.character.life <= this.minLife) {
                      this.statusHunt = false;
                      this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, null);
                      clearInterval(this.characterAtkInterval);
                      if (this.creatureAtkIntervals?.length > 0) {
                        for (let interval of this.creatureAtkIntervals) {
                          clearInterval(interval);
                        }
                        this.creatureAtkIntervals = [];
                      }
                    }
                  }
                }, 2000)
              );
            }, 350*(parseInt(index)+1));
          }
        }
      }
      let manaCost = this.character.slot2Item?.manaRequired || 0
      if (this.character.mana - manaCost >= 0) {
        this.character.mana -= manaCost;
      }
      let characterDamage = CombatUtil.getCharacterDamage(this.character, this.huntStyleSelected?.value || 1)
      let damageReduction = CombatUtil.getCreatureResistence(this.monsters[0], this.character.slot2Item?.element || 'physical')
      let damageTaken = CombatUtil.takeDamage(characterDamage, 0, 0, this.monsters[0].armor, damageReduction);
      this.monsters[0].life -= damageTaken
      if (damageTaken > 0) {
        if (this.character.slot2Item?.element) {
          switch (this.character.slot2Item.element) {
            case 'fire':
              this.highlightCreatureFire[0] = true;
              setTimeout(() => {
                this.highlightCreatureFire[0] = false;
              }, 1200);
              break;
            case 'ice':
              this.highlightCreatureIce[0] = true;
              setTimeout(() => {
                this.highlightCreatureIce[0] = false;
              }, 1200);
              break;
            case 'earth':
              this.highlightCreatureEarth[0] = true;
              setTimeout(() => {
                this.highlightCreatureEarth[0] = false;
              }, 1200);
              break;
            case 'energy':
              this.highlightCreatureEnergy[0] = true;
              setTimeout(() => {
                this.highlightCreatureEnergy[0] = false;
              }, 1200);
              break;
            case 'death':
              this.highlightCreatureDeath[0] = true;
              setTimeout(() => {
                this.highlightCreatureDeath[0] = false;
              }, 1200);
              break;
            case 'holy':
              this.highlightCreatureHoly[0] = true;
              setTimeout(() => {
                this.highlightCreatureHoly[0] = false;
              }, 1200);
              break;
            default:
              this.highlightCreaturePhysical[0] = true;
              setTimeout(() => {
                this.highlightCreaturePhysical[0] = false;
              }, 1200);
              break;
          }
        } else {
          this.highlightCreaturePhysical[0] = true;
          setTimeout(() => {
            this.highlightCreaturePhysical[0] = false;
          }, 500)
        }
      } else {
        this.highlightCreatureBlock[0] = true;
        setTimeout(() => {
          this.highlightCreatureBlock[0] = false;
        }, 500)
      }
      if (this.monsters[0].life <= 0) {
         this.monsters[0].life = 0;
      }
      let elementalExtraDamage = 0
      let extraDamageReduction = 100;
      let element = 'physical';
      if (this.character.slot2Item?.fireDamage > 0) {
        elementalExtraDamage = this.character.slot2Item.fireDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'fire')
        element = 'fire';
      }
      if (this.character.slot2Item?.iceDamage) {
        elementalExtraDamage = this.character.slot2Item.iceDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'ice')
        element = 'ice';
      }
      if (this.character.slot2Item?.earthDamage) {
        elementalExtraDamage = this.character.slot2Item.earthDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'earth')
        element = 'earth';
      }
      if (this.character.slot2Item?.energyDamage) {
        elementalExtraDamage = this.character.slot2Item.energyDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'energy')
        element = 'energy';
      }
      if (this.character.slot2Item?.deathDamage) {
        elementalExtraDamage = this.character.slot2Item.deathDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'death')
        element = 'death';
      }
      if (this.character.slot2Item?.holyDamage) {
        elementalExtraDamage = this.character.slot2Item.holyDamage;
        extraDamageReduction = CombatUtil.getCreatureResistence(this.monsters[0], 'holy')
        element = 'holy';
      }
      let extraDamageTaken = CombatUtil.takeDamage(elementalExtraDamage, 0, 0, this.monsters[0].armor, extraDamageReduction);
      this.monsters[0].life -= extraDamageTaken
      setTimeout(() => {
        if (extraDamageTaken > 0) {
          switch (element) {
            case 'fire':
              this.highlightCreatureFire[0] = true;
              setTimeout(() => {
                this.highlightCreatureFire[0] = false;
              }, 1200);
              break;
            case 'ice':
              this.highlightCreatureIce[0] = true;
              setTimeout(() => {
                this.highlightCreatureIce[0] = false;
              }, 1200);
              break;
            case 'earth':
              this.highlightCreatureEarth[0] = true;
              setTimeout(() => {
                this.highlightCreatureEarth[0] = false;
              }, 1200);
              break;
            case 'energy':
              this.highlightCreatureEnergy[0] = true;
              setTimeout(() => {
                this.highlightCreatureEnergy[0] = false;
              }, 1200);
              break;
            case 'death':
              this.highlightCreatureDeath[0] = true;
              setTimeout(() => {
                this.highlightCreatureDeath[0] = false;
              }, 1200);
              break;
            case 'holy':
              this.highlightCreatureHoly[0] = true;
              setTimeout(() => {
                this.highlightCreatureHoly[0] = false;
              }, 1200);
              break;
            default:
              this.highlightCreaturePhysical[0] = true;
              setTimeout(() => {
                this.highlightCreaturePhysical[0] = false;
              }, 1200);
              break;
          }
        }
      }, 350)
      if (this.monsters[0].life <= 0) {
         this.monsters[0].life = 0;
      }
      if (this.selectedSpellStrike.isArea || this.monsters[0].life > 0) {
        //spell
        if (this.useSpellStrike && this.exaustedSpellStrike == 0) {
          if (this.character.mana >= this.manaToUseSpell && this.character.mana >= this.selectedSpellStrike.manaRequired) {
            this.highlightSpellAttack = true;
            setTimeout(() => {
              this.highlightSpellAttack = false;
            }, 500)
            this.exaustedSpellStrike = this.selectedSpellStrike.exaustedTime || 1;
            let spellDamage = this.getSpellStrikeFormulaValue();
            this.character.mana -= this.selectedSpellStrike.manaRequired
            this.characterService.updateCharacterLifeManaStaminaByValues(this.character.id, this.character.life, this.character.mana, null, null);
            if (this.selectedSpellStrike.isArea) {
              for (let i = 0; i < this.monsters.length; i++) {
                let monster = this.monsters[i]
                let damageReductionSpell = CombatUtil.getCreatureResistence(monster, this.selectedSpellStrike.type || 'physical')
                monster.life -= CombatUtil.takeDamage(spellDamage, 0, 0, monster.armor, damageReductionSpell);
                if (monster.life <= 0) {
                  monster.life = 0;
                }
                setTimeout(() => {
                  switch (this.selectedSpellStrike.type) {
                    case 'fire':
                      if (this.selectedSpellStrike.spell.endsWith("mas flam")) {
                        this.highlightCreatureMasFlam[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureMasFlam[i] = false;
                        }, 1200);
                      } else {
                        this.highlightCreatureFire[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureFire[i] = false;
                        }, 1200);
                      }
                      break;
                    case 'ice':
                      if (this.selectedSpellStrike.spell.endsWith("mas frigo")) {
                        this.highlightCreatureMasFrigo[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureMasFrigo[i] = false;
                        }, 1200);
                      } else {
                        this.highlightCreatureIce[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureIce[i] = false;
                        }, 1200);
                      }
                      break;
                    case 'earth':
                      if (this.selectedSpellStrike.spell.endsWith("mas tera")) {
                        this.highlightCreatureMasTera[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureMasTera[i] = false;
                        }, 1200);
                      } else {
                        this.highlightCreatureEarth[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureEarth[i] = false;
                        }, 1200);
                      }
                      break;
                    case 'energy':
                      if (this.selectedSpellStrike.spell.endsWith("mas vis")) {
                        this.highlightCreatureMasVis[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureMasVis[i] = false;
                        }, 1200);
                      } else {
                        this.highlightCreatureEnergy[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureEnergy[i] = false;
                        }, 1200);
                      }
                      break;
                    case 'death':
                      this.highlightCreatureDeath[i] = true;
                      setTimeout(() => {
                        this.highlightCreatureDeath[i] = false;
                      }, 1200);
                      break;
                    case 'holy':
                      if (this.selectedSpellStrike.spell.endsWith("mas san")) {
                        this.highlightCreatureMasSan[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureMasSan[i] = false;
                        }, 1200);
                      } else {
                        this.highlightCreatureHoly[i] = true;
                        setTimeout(() => {
                          this.highlightCreatureHoly[i] = false;
                        }, 1200);
                      }
                      break;
                    default:
                      this.highlightCreaturePhysical[i] = true;
                      setTimeout(() => {
                        this.highlightCreaturePhysical[i] = false;
                      }, 1200);
                      break;
                  }
                }, 350)
              }
            } else {
              let damageReductionSpell = CombatUtil.getCreatureResistence(this.monsters[0], this.selectedSpellStrike.type || 'physical')
              this.monsters[0].life -= CombatUtil.takeDamage(spellDamage, 0, 0, this.monsters[0].armor, damageReductionSpell);
              if (this.monsters[0].life <= 0) {
                this.monsters[0].life = 0;
              }
              setTimeout(() => {
                switch (this.selectedSpellStrike.type) {
                  case 'fire':
                    this.highlightCreatureFire[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureFire[0] = false;
                    }, 1200);
                    break;
                  case 'ice':
                    this.highlightCreatureIce[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureIce[0] = false;
                    }, 1200);
                    break;
                  case 'earth':
                    this.highlightCreatureEarth[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureEarth[0] = false;
                    }, 1200);
                    break;
                  case 'energy':
                    this.highlightCreatureEnergy[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureEnergy[0] = false;
                    }, 1200);
                    break;
                  case 'death':
                    this.highlightCreatureDeath[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureDeath[0] = false;
                    }, 1200);
                    break;
                  case 'holy':
                    this.highlightCreatureHoly[0] = true;
                    setTimeout(() => {
                      this.highlightCreatureHoly[0] = false;
                    }, 1200);
                    break;
                  default:
                    this.highlightCreaturePhysical[0] = true;
                    setTimeout(() => {
                      this.highlightCreaturePhysical[0] = false;
                    }, 1200);
                    break;
                }
              }, 350)
            }
          }
        }
      }
      this.exaustedSpellStrike = this.exaustedSpellStrike > 0 ? this.exaustedSpellStrike - 1 : 0;
    }, 2000);
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

  shouldDrop(rarity: string): boolean {
    const dropChance = rarity === 'comum' ? 0.15 : rarity === 'incomum' ? 0.09 : rarity === 'raro' ? 0.02 : 0.005
    const randomValue = Math.random();
    return randomValue <= dropChance;
  }

  getHealFormulaValue() {
    if (this.selectedSpellHeal.spell === 'exura ico') {
      // Cura máxima: (lvl*0.2)+(mlvl*7.95)+51
      // Cura mínima: (lvl*0.2)+(mlvl*4)+25
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*4)+25, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*7.95)+51)
    }
    if (this.selectedSpellHeal.spell === 'exura gran ico') {
      // Cura máxima: (lvl*0.2)+(mlvl*80)+98
      // Cura mínima: (lvl*0.2)+(mlvl*64.5)+73
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*64.5)+73, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*80)+98)
    }
    if (this.selectedSpellHeal.spell === 'exura') {
      // Cura máxima: (lvl*0.2)+(mlvl*1.795)+11
      // Cura mínima: (lvl*0.2)+(mlvl*1.4)+8
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*1.4)+8, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*1.795)+11)
    }
    if (this.selectedSpellHeal.spell === 'exura gran') {
      // Cura máxima: (lvl*0.2)+(mlvl*5.59)+35
      // Cura mínima: (lvl*0.2)+(mlvl*3.184)+20
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*3.184)+20, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*5.59)+35)
    }
    if (this.selectedSpellHeal.spell === 'exura vita') {
      // Cura máxima: (lvl*0.2)+(mlvl*12.79)+79
      // Cura mínima: (lvl*0.2)+(mlvl*7.22)+44
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*7.22)+44, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*12.79)+79)
    }
    if (this.selectedSpellHeal.spell === 'exura san') {
      // Cura máxima: (lvl*0.2)+(mlvl*12.7)+70
      // Cura mínima: (lvl*0.2)+(mlvl*7.5)+40
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*7.5)+40, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*12.7)+70)
    }
    if (this.selectedSpellHeal.spell === 'exura gran san') {
      // Cura máxima: (lvl*0.2)+(mlvl*30)+97
      // Cura mínima: (lvl*0.2)+(mlvl*20.5)+71
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*20.5)+71, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*30)+97)
    }
    return 0
  }

  getSpellStrikeFormulaValue() {
    if (this.selectedSpellStrike.spell === 'exori san') {
      // Dano máximo: (lvl*0.2)+(mlvl*3)+18
      // Dano mínimo: (lvl*0.2)+(mlvl*1.79)+11
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*1.79)+11, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*3)+18)
    } 
    if (this.selectedSpellStrike.spell === 'exevo mas san') {
      // Dano máximo: (lvl*0.2)+(mlvl*6)+36
      // Dano mínimo: (lvl*0.2)+(mlvl*4)+22
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*4)+22, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*6)+36)
    } 
    if (this.selectedSpellStrike.spell === 'exori ico') {
      // Dano máximo: (lvl*0.2)+(1.1*(skill+atk))
      // Dano mínimo: (lvl*0.2)+(0.5*(skill+atk))
      let skill = CombatUtil.getCharacterSkill(this.character)
      let atk = CombatUtil.getCharacterAttack(this.character)
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(0.5*(skill+atk)), (this.character.level*0.2)+(1.1*(skill+atk)))
    }
    if (this.selectedSpellStrike.spell === 'exori') {
      // Dano máximo: (lvl*0.2)+(1.5*(skill+atk))
      // Dano mínimo: (lvl*0.2)+(0.5*(skill+atk))
      let skill = CombatUtil.getCharacterSkill(this.character)
      let atk = CombatUtil.getCharacterAttack(this.character)
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(0.5*(skill+atk)), (this.character.level*0.2)+(1.5*(skill+atk)))
    }
    if (this.selectedSpellStrike.spell === 'exori gran') {
      // Dano máximo: (lvl*0.2)+(3*(skill+atk))
      // Dano mínimo: (lvl*0.2)+(1.1*(skill+atk))
      let skill = CombatUtil.getCharacterSkill(this.character)
      let atk = CombatUtil.getCharacterAttack(this.character)
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(1.1*(skill+atk)), (this.character.level*0.2)+(3*(skill+atk)))
    }
    if (this.selectedSpellStrike.spell === 'exevo gran mas vis') {
      // Dano máximo: (lvl*0.2)+(mlvl*12)+65
      // Dano mínimo: (lvl*0.2)+(mlvl*5)+40
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*5)+40, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*12)+65)
    }
    if (this.selectedSpellStrike.spell === 'exevo gran mas flam') {
      // Dano máximo: (lvl*0.2)+(mlvl*14)+130
      // Dano mínimo: (lvl*0.2)+(mlvl*7)+80
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*7)+80, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*14)+130)
    }
    if (this.selectedSpellStrike.spell === 'exevo gran mas tera') {
      // Dano máximo: (lvl*0.2)+(mlvl*10)+65
      // Dano mínimo: (lvl*0.2)+(mlvl*5)+40
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*5)+40, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*10)+65)
    }
    if (this.selectedSpellStrike.spell === 'exevo gran mas frigo') {
      // Dano máximo: (lvl*0.2)+(mlvl*12)+130
      // Dano mínimo: (lvl*0.2)+(mlvl*6)+80
      return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*6)+80, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*12)+130)
    }
    // exoris frigo, flam, vis e tera
    // Dano máximo: (lvl*0.2)+(mlvl*2.203)+13
    // Dano mínimo: (lvl*0.2)+(mlvl*1.403)+8
    return CombatUtil.getRoundedRandomInRange((this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*1.403)+8, (this.character.level*0.2)+(CombatUtil.getCharacterTotalMagicLevel(this.character)*2.203)+13)
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
