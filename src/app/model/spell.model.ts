export class Spell {
    id: number;
    name: string;
    type: string;
    spell: string;
    vocationIds: string;
    levelRequired: number;
    manaRequired: number;
    imagePath?: string;
    exaustedTime: number;
    isArea: boolean;
}