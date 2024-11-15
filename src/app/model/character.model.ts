import { CharacterBestiary } from "./character-bestiary.model";

export class Character {
    id: number;
    name: string;
    sex: boolean;
    vocationId: number;
    level: number;
    experience: number;
    life: number;
    mana: number;
    maxLife: number;
    maxMana: number;
    sword:number;
    club: number;
    axe: number;
    distance: number;
    shielding: number;
    magicLevel: number;
    stamina: number;
    premiun: boolean;
    balance: number;

    bestiary: CharacterBestiary[];
    
    totalArmor: number;
    totalAtk: number;
    totalDef: number;

    swordTrainDate: Date;
    clubTrainDate: Date;
    axeTrainDate: Date;
    distanceTrainDate: Date;
    shieldingTrainDate: Date;
    magicLevelTrainDate: Date;
}