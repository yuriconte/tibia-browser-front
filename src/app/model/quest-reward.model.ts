import { Item } from "./item.model";

export class QuestReward {
    id: number;
    questId: number;
    itemId: number;
    quantity: number;
    item: Item;
}