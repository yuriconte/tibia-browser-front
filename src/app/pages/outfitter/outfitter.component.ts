
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outfitter',
  templateUrl: './outfitter.component.html',
  styleUrls: ['./outfitter.component.css']
})
export class OutfitterComponent implements OnInit {
  // Outfit colors
  outfitColors: string[] = [
    "#FFFFFF", "#FFD4BF", "#FFE9BF", "#FFFFBF", "#E9FFBF", "#D4FFBF", "#BFFFBF", "#BFFFD4", "#BFFFE9", "#BFFFFF",
    "#BFE9FF", "#BFD4FF", "#BFBFFF", "#D4BFFF", "#E9BFFF", "#FFBFFF", "#FFBFE9", "#FFBFD4", "#FFBFBF", "#DADADA",
    "#BF9F8F", "#BFAF8F", "#BFBF8F", "#AFBF8F", "#9FBF8F", "#8FBF8F", "#8FBF9F", "#8FBFAF", "#8FBFBF", "#8FAFBF",
    "#8F9FBF", "#8F8FBF", "#9F8FBF", "#AF8FBF", "#BF8FBF", "#BF8FAF", "#BF8F9F", "#BF8F8F", "#B6B6B6", "#BF7F5F",
    "#BFAF8F", "#BFBF5F", "#9FBF5F", "#7FBF5F", "#5FBF5F", "#5FBF7F", "#5FBF9F", "#5FBFBF", "#5F9FBF", "#5F7FBF",
    "#5F5FBF", "#7F5FBF", "#9F5FBF", "#BF5FBF", "#BF5F9F", "#BF5F7F", "#BF5F5F", "#919191", "#BF6A3F", "#BF943F",
    "#BFBF3F", "#94BF3F", "#6ABF3F", "#3FBF3F", "#3FBF6A", "#3FBF94", "#3FBFBF", "#3F94BF", "#3F6ABF", "#3F3FBF",
    "#6A3FBF", "#943FBF", "#BF3FBF", "#BF3F94", "#BF3F6A", "#BF3F3F", "#6D6D6D", "#FF5500", "#FFAA00", "#FFFF00",
    "#AAFF00", "#54FF00", "#00FF00", "#00FF54", "#00FFAA", "#00FFFF", "#00A9FF", "#0055FF", "#0000FF", "#5500FF",
    "#A900FF", "#FE00FF", "#FF00AA", "#FF0055", "#FF0000", "#484848", "#BF3F00", "#BF7F00", "#BFBF00", "#7FBF00",
    "#3FBF00", "#00BF00", "#00BF3F", "#00BF7F", "#00BFBF", "#007FBF", "#003FBF", "#0000BF", "#3F00BF", "#7F00BF",
    "#BF00BF", "#BF007F", "#BF003F", "#BF0000", "#242424", "#7F2A00", "#7F5500", "#7F7F00", "#557F00", "#2A7F00",
    "#007F00", "#007F2A", "#007F55", "#007F7F", "#00547F", "#002A7F", "#00007F", "#2A007F", "#54007F", "#7F007F",
    "#7F0055", "#7F002A", "#7F0000"
  ];
  
  outfit: string = '129/7_1_1_3.png';
  
  // Selected outfit parameters
  selectedOutfit: { color: number; name: string } = {
    color: 0xFFFFFF,
    name: 'Default Outfit'
  };

  outfitPath: string = "C:/Users/Yuri/Downloads/latest_walk/1340_walk/outfits_anim";
  resizeAllOutfitsTo64px: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  // Function to select an outfit
  selectOutfit(color: number, name: string): void {
    this.selectedOutfit = { color, name };
  }

  loadData(id: number, isMount: boolean = false): boolean {
    // Simula o carregamento de dados para o outfit. Substitua pelo real.
    console.log(`Carregando dados para ID: ${id}, montaria: ${isMount}`);
    // Retorne true se os dados existirem, falso caso contrário.
    return id > 0;
  }

  /**
   * Gera a imagem do outfit.
   * @param head Cor da cabeça.
   * @param body Cor do corpo.
   * @param legs Cor das pernas.
   * @param feet Cor dos pés.
   * @param addons Addons do outfit.
   * @param mount ID da montaria.
   * @param direction Direção (0 = Sul, 1 = Leste, etc.).
   * @param animationFrame Quadro da animação.
   * @returns Uma URL ou canvas contendo a imagem gerada.
   */
  generateImage(
    head: number,
    body: number,
    legs: number,
    feet: number,
    addons: number,
    mount: number,
    direction: number,
    animationFrame: number
  ): string {
    console.log(
      `Gerando imagem: Head=${head}, Body=${body}, Legs=${legs}, Feet=${feet}, Addons=${addons}, Mount=${mount}, Direction=${direction}, Frame=${animationFrame}`
    );

    return `${this.outfitPath}/outfit_${head}_${body}_${legs}_${feet}_${addons}_${mount}_${direction}_${animationFrame}.png`;
  }
}
