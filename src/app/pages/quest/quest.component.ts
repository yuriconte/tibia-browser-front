import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { QuestService } from 'src/app/service/quest.service';
import { Quest } from 'src/app/model/quest.model';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styles: [`
    ::ng-deep .exp-bar .p-progressbar-value {
      background-color: #94a3b8; 
    }
    
    .image-container {
      position: relative; /* Define como referência para os elementos posicionados dentro */
      width: 32px;
      height: 32px;
    }

    .image-container img {
      display: block; /* Garante que a imagem ocupe todo o espaço do contêiner */
      width: 100%;
      height: 100%;
    }

    .status-icon {
      position: absolute;
      top: 0; /* Posiciona no topo */
      right: 0; /* Posiciona à direita */
      width: 10px;
      height: 10px;
      border-radius: 50%; /* Torna o elemento circular */
      background-color: transparent; /* Cor inicial transparente */
    }

    .status-icon.check {
      background-color: green; /* Cor para "check" */
    }

    .status-icon.ban {
      background-color: red; /* Cor para "ban" */
    }

    .completed {
      background: #5eead42e;
    }

  `],
  providers: [MessageService]
})
export class QuestComponent {
 
  character: Character = new Character;

  remainingTime: number;
  timerInterval: any;
  progress: string;

  questsRook: Quest[] = [];
  questsMain: Quest[] = [];

  showDetail: boolean = false;
  selectedQuest: Quest;

  expNextLevel:number = 0;
  expPreviousLevel:number = 0;

  constructor(private characterService: CharacterService,
    private questService: QuestService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
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
            this.loadQuests();
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

  calcRemainingTime(quest: Quest) {
    if (this.character.questDate && this.character.questId === quest.id) {
      return (quest.timeInHours*3600) - this.getDifferenceFromNowInSeconds(this.character.questDate)
    } else {
      return (quest.timeInHours*3600)
    }
  }

  loadQuests() {
    this.questService.getAll().subscribe({
      next: (data) => {
          this.questsRook = data.filter(quest => (quest.levelRequired <= 8));
          this.questsMain = data.filter(quest => (quest.levelRequired > 8));
          this.prepareQuests();
          if (this.character.questDate) {
            this.remainingTime = (this.character.questTimeInHours*3600) - this.getDifferenceFromNowInSeconds(this.character.questDate);
            if (this.remainingTime < 0) {
              this.remainingTime = 0
            }
            this.initQuest(data.find(quest=> quest.id === this.character.questId))
          }
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter potions." });
      }
    });
  }

  prepareQuests() {
    this.questsRook.forEach(quest => {
      if (this.character.quests?.length > 0) {
        this.character.quests?.forEach(questCompleted => {
          if (questCompleted.quest.id === quest.id) {
            quest.completed = true;
            return;
          }
        })
      }
      let countKilled = 0;
      quest.creatures?.forEach(creature => {
        this.character.bestiary?.forEach(bestiary => {
          if (bestiary?.bestiary?.creature?.id === creature?.creature?.id) {
            creature.creature.killed = true;
            countKilled += 1;
            return;
          }
        })
      })
      quest.disabled = quest.creatures?.length > 0 ? quest.creatures.length !== countKilled : false;
    });
    this.questsMain.forEach(quest => {
      if (this.character.quests?.length > 0) {
        this.character.quests?.forEach(questCompleted => {
          if (questCompleted.quest.id === quest.id) {
            quest.completed = true;
            return;
          }
        })
      }
      let countKilled = 0;
      quest.creatures?.forEach(creature => {
        this.character.bestiary?.forEach(bestiary => {
          if (bestiary?.bestiary?.creature?.id === creature?.creature?.id) {
            creature.creature.killed = true;
            countKilled += 1;
            return;
          }
        })
      })
      quest.disabled = quest.creatures?.length > 0 ? quest.creatures.length !== countKilled : false;
    });
  }

  startQuest(quest: Quest) {
    this.character.questDate = new Date();
    this.character.questId = quest.id;
    this.character.questTimeInHours = quest.timeInHours;
    this.remainingTime = this.calcRemainingTime(quest);
    this.characterService.startQuest(this.character.id, quest.timeInHours, quest.id)
    this.initQuest(quest)
  }

  initQuest(quest: Quest) {
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      let totalTime = this.calcRemainingTime(quest);
      this.progress = (((totalTime - this.remainingTime) / totalTime) * 100).toFixed(0);
      if (this.remainingTime <= 0) {
        this.finishQuest(quest);
      }
    }, 1000);
  }

  finishQuest(quest: Quest) {
    let expEarned = quest.expReward || 0;
    let itemLooted: number[] = [];
    if (quest.rewards) {
      quest.rewards.forEach(item => {
        itemLooted.push(item.item.id)
      })
    }
    this.remainingTime = 0;
    let goldEarned = quest.goldReward || 0;
    this.characterService.updateCharacter(this.character.id, quest.id, null, expEarned, this.character.life, this.character.mana, null, goldEarned, itemLooted);
    while (this.character.experience + expEarned >= this.expNextLevel) {
      this.characterService.increaseLevel(this.character.id);
      this.character.level++;
      this.expNextLevel = this.calculateExpLevelFormula(this.character.level);
    }
    this.character.questDate = null;
    this.character.questId = null;
    this.character.questTimeInHours = null;
    this.characterService.cancelQuest(this.character.id)
    clearInterval(this.timerInterval);
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Task " + quest.name + " concluída com sucesso!"});
  }

  cancelQuest() {
    this.character.questDate = null;
    this.character.questId = null;
    this.character.questTimeInHours = null;
    this.remainingTime = 0;
    this.characterService.cancelQuest(this.character.id)
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
  
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;
    const secondsInMonth = 2592000; // Aproximadamente 30 dias
  
    if (seconds >= (secondsInMonth*12)) {
      const years = Math.floor(seconds / (secondsInMonth*12));
      const remainingSeconds = seconds % (secondsInMonth*12);
      const months = Math.floor(remainingSeconds / secondsInMonth);
      return `${years}A ${months}M`;
    } else if (seconds >= secondsInMonth) {
      const months = Math.floor(seconds / secondsInMonth);
      const remainingSeconds = seconds % secondsInMonth;
      const days = Math.floor(remainingSeconds / secondsInDay);
      return `${months}M  ${days}D`;
    } else if (seconds >= secondsInWeek) {
      const weeks = Math.floor(seconds / secondsInWeek);
      const remainingSeconds = seconds % secondsInWeek;
      const days = Math.floor(remainingSeconds / secondsInDay);
      return `${weeks}S  ${days}D`;
    } else if (seconds >= secondsInDay) {
      const days = Math.floor(seconds / secondsInDay);
      const remainingSeconds = seconds % secondsInDay;
      const hours = Math.floor(remainingSeconds / secondsInHour);
      return `${days}D  ${hours.toString().padStart(2, '0')}h`;
    } else {
      const hours = Math.floor(seconds / secondsInHour);
      const minutes = Math.floor((seconds % secondsInHour) / secondsInMinute);
      const remainingSeconds = seconds % secondsInMinute;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
  
  showQuestDetail(quest: Quest) {
    this.selectedQuest = quest
    this.showDetail = true;
  }

}
