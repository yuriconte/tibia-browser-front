import { Character } from "./character.model";
import { Creature } from "./creature.model";
import { Item } from "./item.model";

export class CharacterDeath {
    id: number;
    character: Character;
    creature: Creature
    level: number;
    date: Date;
}