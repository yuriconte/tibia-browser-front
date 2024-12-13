import { CharacterBestiary } from "./character-bestiary.model";
import { CharacterItem } from "./character-item.model";
import { CharacterPotion } from "./character-potion.model";
import { CharacterQuest } from "./character-quest.model";
import { Item } from "./item.model";

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
    magicDamage: boolean;

    swordTrainDate: Date;
    clubTrainDate: Date;
    axeTrainDate: Date;
    distanceTrainDate: Date;
    shieldingTrainDate: Date;
    magicLevelTrainDate: Date;

    slot1Item: Item;
    slot2Item: Item;
    slot3Item: Item;
    slot4Item: Item;
    slot5Item: Item;
    slot6Item: Item;
    slotAmmo: Item;
    slotAmulet: Item;
    slotRing: Item;
    items: CharacterItem[];
    potions: CharacterPotion[];

    huntOfflineDate: Date;
    huntOfflineBestiaryId: number;
    huntOfflineTimeInHours: number;

    quests: CharacterQuest[];

    questDate: Date;
    questId: number;
    questTimeInHours: number;

    arena1: number;
    arena2: number;
    arena3: number;
}