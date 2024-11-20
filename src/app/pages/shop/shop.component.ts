import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { PotionService } from 'src/app/service/potion.service';
import { Potion } from 'src/app/model/potion.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
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
export class ShopComponent {
 
  character: Character;
  potions: Potion[];

  constructor(private characterService: CharacterService,
    private potionService: PotionService,
    private authService: AuthService,
    private service: MessageService) {}

  ngOnInit() {
    this.loadCharacter();
  }

  loadCharacter() {
    let username = this.authService.getUser();
    if (username != null) {
      this.characterService.getCharacter(username).subscribe({
        next: (data) => {
            this.character = data;
            this.loadPotions();
        },
        error: () => {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
        }
      });
    } else {
      this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter dados do personagem." });
    }
  }

  loadPotions() {
    this.potionService.getAll().subscribe({
      next: (data) => {
          this.potions = data.filter(potion => (potion.vocationIds.split(',').includes(this.character.vocationId.toString()) && potion.levelRequired <= this.character.level));
          this.preparePotions();
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter potions." });
      }
    });
  }

  private preparePotions() {
    this.potions.forEach(potion => {
      if (this.character.balance >= potion.gold) {
        potion.buyQuantity = 1;
        potion.maxQuantity = this.character.balance / potion.gold;
        potion.minQuantity = 1;
      } else {
        potion.buyQuantity = 1;
        potion.maxQuantity = 0;
        potion.minQuantity = 0;
      }
    });
  }

  buyPotion(potion: Potion) {
    this.characterService.buyPotion(this.character.id, potion.id, potion.buyQuantity, potion.buyQuantity*potion.gold);
    this.character.balance -= potion.buyQuantity*potion.gold;
    this.service.add({ key: 'tst', severity: 'success', summary: 'Parabéns', detail: 'Potions compradas com sucesso' });
    this.preparePotions();
  }
 
}
