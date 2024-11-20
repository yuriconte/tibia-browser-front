export class Potion {
    id: number;
    name: string;
    type: string;
    vocationIds: string;
    levelRequired: number;
    min: number;
    max: number;
    imagePath?: string;
    gold: number;

    minQuantity: number;
    maxQuantity: number;
    buyQuantity: number;
}