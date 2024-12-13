export class Item {
    id: number;
    name: string;
    type: string;
    slot: number;
    def: number;
    armor: number;
    atk: number;
    gold: number;
    imagePath: string;
    levelRequired: number;
    manaRequired: number;

    // Propriedades adicionais
    twoHanded: number;
    bonusDef: number;
    bonusArm: number;
    bonusSword: number;
    bonusAxe: number;
    bonusClub: number;
    bonusShielding: number;
    bonusMagicLevel: number;
    countHealing: number;
    countMana: number;
    fireDamage: number;
    earthDamage: number;
    energyDamage: number;
    iceDamage: number;
    deathDamage: number;
    holyDamage: number;
    physicalResistance: number;
    fireResistance: number;
    earthResistance: number;
    energyResistance: number;
    iceResistance: number;
    deathResistance: number;
    holyResistance: number;
    bonusSpeed: number;
    magicShield: number;
    bonusDistance: number;
    freeBuyable: number;
    imbuementsSlots: number;
    maxTier: number;
    element: string;
    areaDamage: number;

    buyable: boolean; // Campo existente
}
