import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/service/character.service';
import { AuthService } from '../auth/auth.service';
import { Character } from 'src/app/model/character.model';
import { PotionService } from 'src/app/service/potion.service';
import { Potion } from 'src/app/model/potion.model';
import { Item } from 'src/app/model/item.model';
import { ItemService } from 'src/app/service/item.service';

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
  wands: Item[];
  rods: Item[];
  arrows: Item[];
  bolts: Item[];

  constructor(private characterService: CharacterService,
    private potionService: PotionService,
    private itemService: ItemService,
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
            this.loadWands();
            this.loadRods();
            this.loadArrows();
            this.loadBolts();
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

  loadWands() {
    this.itemService.getWands().subscribe({
      next: (data) => {
          this.wands = data;
          this.prepareItems(this.wands);
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter wands." });
      }
    });
  }

  loadRods() {
    this.itemService.getRods().subscribe({
      next: (data) => {
          this.rods = data;
          this.prepareItems(this.rods);
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter rods." });
      }
    });
  }

  private prepareItems(items: Item[]) {
    items.forEach(item => {
      if (this.character.balance >= item.gold) {
        item.buyable = true
      } else {
        item.buyable = false
      }
    });
  }

  buyItem(item: Item) {
    this.characterService.buyItem(this.character.id, item.id, item.gold);
    this.character.balance -= item.gold;
    this.service.add({ key: 'tst', severity: 'success', summary: 'Parabéns', detail: 'Item comprado com sucesso' });
    this.prepareItems(this.wands);
    this.prepareItems(this.rods);
  }

  loadArrows() {
    this.itemService.getArrows().subscribe({
      next: (data) => {
          this.arrows = data?.filter(item => item.name != 'Bow');
          this.prepareItems(this.arrows);
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter arrows." });
      }
    });
  }

  loadBolts() {
    this.itemService.getBolts().subscribe({
      next: (data) => {
          this.bolts = data?.filter(item => item.name != 'Crossbow' && item.name != 'Arbalest');
          this.prepareItems(this.bolts);
      },
      error: () => {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Erro ao obter arrows." });
      }
    });
  }
 
}
