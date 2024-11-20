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
    items: CreatureItem[];
    damages: CreatureDamage[];
}