import { QuestCreature } from "./quest-creature.model";
import { QuestReward } from "./quest-reward.model";

export class Quest {
    id: number;
    name: string;
    timeInHours: number;
    levelRequired: number; 
    goldRequired: number; 
    goldReward: number; 
    expReward: number;
    rewards: QuestReward[];
    creatures: QuestCreature[];

    completed: boolean;
    disabled: boolean;
}