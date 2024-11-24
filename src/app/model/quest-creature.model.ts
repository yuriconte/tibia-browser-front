import { Creature } from "./creature.model";

export class QuestCreature {
    id: number;
    questId: number;
    creatureId: number;
    creature: Creature; 
}