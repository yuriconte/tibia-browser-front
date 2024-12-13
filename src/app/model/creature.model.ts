import { CreatureDamage } from "./creature-damage.model";
import { CreatureItem } from "./creature-item.model";

export class Creature {
    id: number;
    name: string;
    life: number;
    maxLife: number;
    armor: number;
    minDamage: number;
    maxDamage: number;
    experience: number;
    tagType: string;
    tagLabel: string;
    expHour: string;
    imgPath: string;
    minGold: number;
    maxGold: number;
    type: number;
    arenaType: number;
    bossType: number;
    items: CreatureItem[];
    damages: CreatureDamage[];
    physicalResistance: number;
    fireResistance: number;
    earthResistance: number;
    energyResistance: number;
    iceResistance: number;
    deathResistance: number;
    holyResistance: number;
    
    killed: boolean;
}