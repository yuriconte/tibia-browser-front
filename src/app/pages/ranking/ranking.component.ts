import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styles: [`
    .image-container {
      position: relative;
      display: inline-block;
    }

    .image-container img {
      display: block;
    }

    .p-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  `],
  providers: [MessageService]
})
export class RankingComponent {
 
  characters: Character[] = [];
  selectedRanking: any;
  rankings: any[] = [
    {id: 1, name: "Level"}, 
    {id: 2, name: "Sword"}, 
    {id: 3, name: "Axe"}, 
    {id: 4, name: "Club"}, 
    {id: 5, name: "Distance"}, 
    {id: 6, name: "Shielding"},
    {id: 7, name: "Magic Level"}
  ]

  constructor(private characterService: CharacterService,
    private service: MessageService) {}

  ngOnInit() {
    this.loadAllCharacter();
    this.selectedRanking = this.rankings[0]
  }

  loadAllCharacter() {
    this.characterService.getAll().subscribe({
      next: (data) => {
          this.characters = data;
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter ranking." });
      }
    });
  }

  onRankingChange(event: any) {
    this.sortCharacters();
  }

  sortCharacters() {
    if (this.selectedRanking.name === 'Level') {
      this.characters.sort((a, b) => b.level - a.level);
    } else if (this.selectedRanking.name === 'Sword') {
      this.characters.sort((a, b) => b.sword - a.sword);
    } else if (this.selectedRanking.name === 'Axe') {
      this.characters.sort((a, b) => b.axe - a.axe);
    } else if (this.selectedRanking.name === 'Club') {
      this.characters.sort((a, b) => b.club - a.club);
    } else if (this.selectedRanking.name === 'Distance') {
      this.characters.sort((a, b) => b.distance - a.distance);
    } else if (this.selectedRanking.name === 'Shielding') {
      this.characters.sort((a, b) => b.shielding - a.shielding);
    } else if (this.selectedRanking.name === 'Magic Level') {
      this.characters.sort((a, b) => b.magicLevel - a.magicLevel);
    }
  }
 
}
