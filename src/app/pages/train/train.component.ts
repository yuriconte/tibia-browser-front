import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styles: [`
    ::ng-deep .exp-bar .p-progressbar-value {
      background-color: #94a3b8; 
    }
  `],
  providers: [MessageService]
})
export class TrainComponent {
 
  character: Character = new Character;

  //sword
  remainingSwordTime: number;
  timerSwordInterval: any;
  progressSword: string;

  //axe
  remainingAxeTime: number;
  timerAxeInterval: any;
  progressAxe: string;

  //club
  remainingClubTime: number;
  timerClubInterval: any;
  progressClub: string;

  //distance
  remainingDistanceTime: number;
  timerDistanceInterval: any;
  progressDistance: string;

  //shielding
  remainingShieldingTime: number;
  timerShieldingInterval: any;
  progressShielding: string;

  //magic level
  remainingMagicLevelTime: number;
  timerMagicLevelInterval: any;
  progressMagicLevel: string;

  constructor(private characterService: CharacterService,
    private service: MessageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadCharacter();
  }

  ngOnDestroy() {
    if (this.timerSwordInterval) {
      clearInterval(this.timerSwordInterval);
    }

    if (this.timerAxeInterval) {
      clearInterval(this.timerAxeInterval);
    }

    if (this.timerClubInterval) {
      clearInterval(this.timerClubInterval);
    }

    if (this.timerDistanceInterval) {
      clearInterval(this.timerDistanceInterval);
    }

    if (this.timerShieldingInterval) {
      clearInterval(this.timerShieldingInterval);
    }

    if (this.timerMagicLevelInterval) {
      clearInterval(this.timerMagicLevelInterval);
    }
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
            if (this.character.swordTrainDate) {
              this.remainingSwordTime = this.calcRemaingTime(this.character.sword) - this.getDifferenceFromNowInSeconds(this.character.swordTrainDate);
              this.initSwordTraining()
            } else {
              this.remainingSwordTime = this.calcRemaingTime(this.character.sword);
            }
            if (this.character.axeTrainDate) {
              this.remainingAxeTime = this.calcRemaingTime(this.character.axe) - this.getDifferenceFromNowInSeconds(this.character.axeTrainDate);
              this.initAxeTraining()
            } else {
              this.remainingAxeTime = this.calcRemaingTime(this.character.axe);
            }
            if (this.character.clubTrainDate) {
              this.remainingClubTime = this.calcRemaingTime(this.character.club) - this.getDifferenceFromNowInSeconds(this.character.clubTrainDate);
              this.initClubTraining()
            } else {
              this.remainingClubTime = this.calcRemaingTime(this.character.club);
            }
            if (this.character.distanceTrainDate) {
              this.remainingDistanceTime = this.calcRemaingTimeDistace(this.character.distance) - this.getDifferenceFromNowInSeconds(this.character.distanceTrainDate);
              this.initDistanceTraining()
            } else {
              this.remainingDistanceTime = this.calcRemaingTimeDistace(this.character.distance);
            }
            if (this.character.shieldingTrainDate) {
              this.remainingShieldingTime = this.calcRemaingTimeShield(this.character.shielding) - this.getDifferenceFromNowInSeconds(this.character.shieldingTrainDate);
              this.initShieldingTraining()
            } else {
              this.remainingShieldingTime = this.calcRemaingTimeShield(this.character.shielding);
            }
            if (this.character.magicLevelTrainDate) {
              this.remainingMagicLevelTime = this.calcRemaingTimeML(this.character.magicLevel) - this.getDifferenceFromNowInSeconds(this.character.magicLevelTrainDate);
              this.initMagicLevelTraining()
            } else {
              this.remainingMagicLevelTime = this.calcRemaingTimeML(this.character.magicLevel);
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

  /* ------------------------------- SWORD ----------------------------------- */
  startSwordTraining() {
    this.character.swordTrainDate = new Date();
    this.remainingSwordTime = this.calcRemaingTime(this.character.sword);
    this.characterService.startSword(this.character.id)
    this.initSwordTraining()
  }

  initSwordTraining() {
    this.timerSwordInterval = setInterval(() => {
      this.remainingSwordTime--;
      let totalTime = this.calcRemaingTime(this.character.sword);
      this.progressSword = (((totalTime - this.remainingSwordTime) / totalTime) * 100).toFixed(0);
      if (this.remainingSwordTime <= 0) {
        this.finishSwordTraining();
      }
    }, 1000);
  }

  finishSwordTraining() {
    this.character.swordTrainDate = null;
    this.character.sword += 1;
    clearInterval(this.timerSwordInterval);
    this.remainingSwordTime = this.calcRemaingTime(this.character.sword);
    this.characterService.increaseSword(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua skill de Sword subiu para " + this.character.sword + "!"});
  }

  /* ------------------------------- AXE ----------------------------------- */
  startAxeTraining() {
    this.character.axeTrainDate = new Date();
    this.remainingAxeTime = this.calcRemaingTime(this.character.axe);
    this.characterService.startAxe(this.character.id)
    this.initAxeTraining()
  }

  initAxeTraining() {
    this.timerAxeInterval = setInterval(() => {
      this.remainingAxeTime--;
      let totalTime = this.calcRemaingTime(this.character.axe);
      this.progressAxe = (((totalTime - this.remainingAxeTime) / totalTime) * 100).toFixed(0);
      if (this.remainingAxeTime <= 0) {
        this.finishAxeTraining();
      }
    }, 1000);
  }

  finishAxeTraining() {
    this.character.axeTrainDate = null;
    this.character.axe += 1;
    clearInterval(this.timerAxeInterval);
    this.remainingAxeTime = this.calcRemaingTime(this.character.axe);
    this.characterService.increaseAxe(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua skill de Axe subiu para " + this.character.axe + "!"});
  }

  /* ------------------------------- CLUB ----------------------------------- */
  startClubTraining() {
    this.character.clubTrainDate = new Date();
    this.remainingClubTime = this.calcRemaingTime(this.character.club);
    this.characterService.startClub(this.character.id)
    this.initClubTraining()
  }

  initClubTraining() {
    this.timerClubInterval = setInterval(() => {
      this.remainingClubTime--;
      let totalTime = this.calcRemaingTime(this.character.club);
      this.progressClub = (((totalTime - this.remainingClubTime) / totalTime) * 100).toFixed(0);
      if (this.remainingClubTime <= 0) {
        this.finishClubTraining();
      }
    }, 1000);
  }

  finishClubTraining() {
    this.character.clubTrainDate = null;
    this.character.club += 1;
    clearInterval(this.timerClubInterval);
    this.remainingClubTime = this.calcRemaingTime(this.character.club);
    this.characterService.increaseClub(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua skill de Club subiu para " + this.character.club + "!"});
  }

  /* ------------------------------- DISTANCE ----------------------------------- */
  startDistanceTraining() {
    this.character.distanceTrainDate = new Date();
    this.remainingDistanceTime = this.calcRemaingTimeDistace(this.character.distance);
    this.characterService.startDistance(this.character.id)
    this.initDistanceTraining()
  }

  initDistanceTraining() {
    this.timerDistanceInterval = setInterval(() => {
      this.remainingDistanceTime--;
      let totalTime = this.calcRemaingTimeDistace(this.character.distance);
      this.progressDistance = (((totalTime - this.remainingDistanceTime) / totalTime) * 100).toFixed(0);
      if (this.remainingDistanceTime <= 0) {
        this.finishDistanceTraining();
      }
    }, 1000);
  }

  finishDistanceTraining() {
    this.character.distanceTrainDate = null;
    this.character.distance += 1;
    clearInterval(this.timerDistanceInterval);
    this.remainingDistanceTime = this.calcRemaingTimeDistace(this.character.distance);
    this.characterService.increaseDistance(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua skill de Distance subiu para " + this.character.distance + "!"});
  }

  /* ------------------------------- SHIELDING ----------------------------------- */
  startShieldingTraining() {
    this.character.shieldingTrainDate = new Date();
    this.remainingShieldingTime = this.calcRemaingTimeShield(this.character.shielding);
    this.characterService.startShielding(this.character.id)
    this.initShieldingTraining()
  }

  initShieldingTraining() {
    this.timerShieldingInterval = setInterval(() => {
      this.remainingShieldingTime--;
      let totalTime = this.calcRemaingTimeShield(this.character.shielding);
      this.progressShielding = (((totalTime - this.remainingShieldingTime) / totalTime) * 100).toFixed(0);
      if (this.remainingShieldingTime <= 0) {
        this.finishShieldingTraining();
      }
    }, 1000);
  }

  finishShieldingTraining() {
    this.character.shieldingTrainDate = null;
    this.character.shielding += 1;
    clearInterval(this.timerShieldingInterval);
    this.remainingShieldingTime = this.calcRemaingTimeShield(this.character.shielding);
    this.characterService.increaseShielding(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Sua skill de Shielding subiu para " + this.character.shielding + "!"});
  }

  /* ------------------------------- MAGIC LEVEL ----------------------------------- */
  startMagicLevelTraining() {
    this.character.magicLevelTrainDate = new Date();
    this.remainingMagicLevelTime = this.calcRemaingTimeML(this.character.magicLevel);
    this.characterService.startMagicLevel(this.character.id)
    this.initMagicLevelTraining()
  }

  initMagicLevelTraining() {
    this.timerMagicLevelInterval = setInterval(() => {
      this.remainingMagicLevelTime--;
      let totalTime = this.calcRemaingTimeML(this.character.magicLevel);
      this.progressMagicLevel = (((totalTime - this.remainingMagicLevelTime) / totalTime) * 100).toFixed(0);
      if (this.remainingMagicLevelTime <= 0) {
        this.finishMagicLevelTraining();
      }
    }, 1000);
  }

  finishMagicLevelTraining() {
    this.character.magicLevelTrainDate = null;
    this.character.magicLevel += 1;
    clearInterval(this.timerMagicLevelInterval);
    this.remainingMagicLevelTime = this.calcRemaingTimeML(this.character.magicLevel);
    this.characterService.increaseMagicLevel(this.character.id)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: "Seu Magic Level subiu para " + this.character.magicLevel + "!"});
  }

  cancelTraining() {
    this.character.swordTrainDate = null;
    this.character.axeTrainDate = null;
    this.character.clubTrainDate = null;
    this.character.distanceTrainDate = null;
    this.character.shieldingTrainDate = null;
    this.character.magicLevelTrainDate = null;
    if (this.timerSwordInterval) {
      clearInterval(this.timerSwordInterval);
    }

    if (this.timerAxeInterval) {
      clearInterval(this.timerAxeInterval);
    }

    if (this.timerClubInterval) {
      clearInterval(this.timerClubInterval);
    }

    if (this.timerDistanceInterval) {
      clearInterval(this.timerDistanceInterval);
    }

    if (this.timerShieldingInterval) {
      clearInterval(this.timerShieldingInterval);
    }

    if (this.timerMagicLevelInterval) {
      clearInterval(this.timerMagicLevelInterval);
    }
    this.remainingSwordTime = this.calcRemaingTime(this.character.sword);
    this.remainingAxeTime = this.calcRemaingTime(this.character.axe);
    this.remainingClubTime = this.calcRemaingTime(this.character.club);
    this.remainingDistanceTime = this.calcRemaingTimeDistace(this.character.distance);
    this.remainingShieldingTime = this.calcRemaingTimeShield(this.character.shielding);
    this.remainingMagicLevelTime = this.calcRemaingTimeML(this.character.magicLevel);
    this.characterService.cancelSkill(this.character.id)
  }


  calcRemaingTimeDistace(x:number) {
    /* 50*(y^(x-10))
    x = skill atual, 
    y = fator (pally 1.1, pally 1.4, mage/rook 2)
    */
    let y = this.character.vocationId === 3 || this.character.vocationId === 7 ? 1.1 : this.character.vocationId === 2 ||  this.character.vocationId === 6 ? 1.4 : 2
    let result = Math.round(50 * Math.pow(y, x - 10))
    return result >= 0 ? result : 0
  }

  calcRemaingTime(x:number) {
    /* 50*(y^(x-10))
    x = skill atual, 
    y = fator (kina 1.1, pally 1.2, mage/rook 2)
    */
    let y = this.character.vocationId === 2 ||  this.character.vocationId === 6 ? 1.1 : this.character.vocationId === 3 || this.character.vocationId === 7 ? 1.2 : 2
    let result = Math.round(50 * Math.pow(y, x - 10))
    return result >= 0 ? result : 0
  }

  calcRemaingTimeShield(x:number) {
    /* 50*(y^(x-10))
    x = skill atual, 
    y = fator (kina 1.1, pally 1.2, mage/rook 2)
    */
    let y = this.character.vocationId === 2 ||  this.character.vocationId === 6 || this.character.vocationId === 3 || this.character.vocationId === 7 ? 1.1 : 2
    let result = Math.round(50 * Math.pow(y, x - 10))
    return result >= 0 ? result : 0
  }

  calcRemaingTimeML(x:number) {
    /* 1600*(f^x) 
    x = ml atual, 
    f = fator (mage 1.1, pally 1.4, kina 3)
    */
    x +=1
    let f = this.character.vocationId === 4 || this.character.vocationId === 5 || this.character.vocationId === 8 || this.character.vocationId === 9 ? 1.1 : this.character.vocationId === 3 || this.character.vocationId === 7 ? 1.4 : 3
    let result = Math.round(17 * Math.pow(f, x));
    return result >= 0 ? result : 0
  }

  // formatTime(seconds: number): string {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  // }

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
  
 
}
