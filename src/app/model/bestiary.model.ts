import { Creature } from "./creature.model";

export class Bestiary {
    id: number;
    creature: Creature;
    totalKillsTier1: number;
    totalKillsTier2: number;
    totalKillsTier3: number;
    disabled: boolean;
}