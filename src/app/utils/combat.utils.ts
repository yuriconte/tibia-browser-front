import { Character } from "../model/character.model";
import { CreatureDamage } from "../model/creature-damage.model";
import { Creature } from "../model/creature.model";
import { Item } from "../model/item.model";

export class CombatUtil {

    static getRandomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static getRoundedRandomInRange(min: number, max: number): number {
        return Math.round(this.getRandomInRange(min, max));
    }

    static getCharacterDamageFactor(character: Character): number {
        let factor = 0.085; //padrão para dano corpo a corpo
        if (character.slot2Item?.type) {
            switch (character.slot2Item.type) {
                case 'distance':
                case 'arrow':
                case 'bolt':
                    factor = 0.090;
                    break;
                default:
                    break;
            }
            return factor;
        } else {
            return factor;
        }
    }

    static getCharacterSkill(character: Character): number {
        let skillValue = 10; //padrão fist fighting
        if (character.slot2Item?.type) {
            switch (character.slot2Item.type) {
                case 'sword':
                    skillValue = character.sword;
                    skillValue += character.slotAmulet?.bonusSword || 0
                    skillValue += character.slot1Item?.bonusSword || 0
                    skillValue += character.slot2Item?.bonusSword || 0
                    skillValue += character.slot3Item?.bonusSword || 0
                    skillValue += character.slot4Item?.bonusSword || 0
                    skillValue += character.slotRing?.bonusSword || 0
                    skillValue += character.slot5Item?.bonusSword || 0
                    skillValue += character.slot6Item?.bonusSword || 0
                    break;
                case 'axe':
                    skillValue = character.axe;
                    skillValue += character.slotAmulet?.bonusAxe || 0
                    skillValue += character.slot1Item?.bonusAxe || 0
                    skillValue += character.slot2Item?.bonusAxe || 0
                    skillValue += character.slot3Item?.bonusAxe || 0
                    skillValue += character.slot4Item?.bonusAxe || 0
                    skillValue += character.slotRing?.bonusAxe || 0
                    skillValue += character.slot5Item?.bonusAxe || 0
                    skillValue += character.slot6Item?.bonusAxe || 0
                    break;
                case 'club':
                    skillValue = character.club;
                    skillValue += character.slotAmulet?.bonusClub || 0
                    skillValue += character.slot1Item?.bonusClub || 0
                    skillValue += character.slot2Item?.bonusClub || 0
                    skillValue += character.slot3Item?.bonusClub || 0
                    skillValue += character.slot4Item?.bonusClub || 0
                    skillValue += character.slotRing?.bonusClub || 0
                    skillValue += character.slot5Item?.bonusClub || 0
                    skillValue += character.slot6Item?.bonusClub || 0
                    break;
                case 'distance':
                case 'arrow':
                case 'bolt':
                    skillValue = character.distance;
                    skillValue += character.slotAmulet?.bonusDistance || 0
                    skillValue += character.slot1Item?.bonusDistance || 0
                    skillValue += character.slot2Item?.bonusDistance || 0
                    skillValue += character.slot3Item?.bonusDistance || 0
                    skillValue += character.slot4Item?.bonusDistance || 0
                    skillValue += character.slotRing?.bonusDistance || 0
                    skillValue += character.slot5Item?.bonusDistance || 0
                    skillValue += character.slot6Item?.bonusDistance || 0
                    break;
                case 'wand':
                case 'rod':
                    skillValue = 0;
                    break;
                default:
                    break;
            }
            return skillValue;
        } else {
            return skillValue;
        }
    }

    static getCharacterAttack(character: Character): number {
        let attack = 0; //padrão 0 (sem arma)
        if (character.slot2Item?.type) {
            switch (character.slot2Item.type) {
                //para bows e crossbows, somase o dano da arma ao dano da munição
                case 'arrow':
                case 'bolt':
                    //se nao tiver municao equipada, nao da dano nenhum
                    if (character.slotAmmo?.type) {
                        attack = character.slot2Item.atk + character.slotAmmo.atk;
                    }
                    break;
                default:
                    //para qualquer outro caso diferente de bow e crossbow, usa o ataque da arma normalmente
                    attack = character.slot2Item.atk;
                    break;
            }
            return attack;
        } else {
            return attack;
        }
    }

    static getCharacterTotalArmor(character: Character): number {
        return (character.slot1Item?.armor || 0) + (character.slot3Item?.armor || 0) + (character.slot5Item?.armor || 0) + (character.slot6Item?.armor || 0)
    }

    static getCharacterTotalDefense(character: Character): number {
        return (character.slot2Item?.def || 0) + (character.slot4Item?.def || 0)
    }

    static getCharacterTotalShielding(character: Character): number {
        let shielding = character.shielding;
        shielding += character.slotAmulet?.bonusShielding || 0
        shielding += character.slot1Item?.bonusShielding || 0
        shielding += character.slot2Item?.bonusShielding || 0
        shielding += character.slot3Item?.bonusShielding || 0
        shielding += character.slot4Item?.bonusShielding || 0
        shielding += character.slotRing?.bonusShielding || 0
        shielding += character.slot5Item?.bonusShielding || 0
        shielding += character.slot6Item?.bonusShielding || 0
        return shielding
    }

    static getCharacterTotalMagicLevel(character: Character): number {
        let magicLevel = character.magicLevel;
        magicLevel += character.slotAmulet?.bonusMagicLevel || 0
        magicLevel += character.slot1Item?.bonusMagicLevel || 0
        magicLevel += character.slot2Item?.bonusMagicLevel || 0
        magicLevel += character.slot3Item?.bonusMagicLevel || 0
        magicLevel += character.slot4Item?.bonusMagicLevel || 0
        magicLevel += character.slotRing?.bonusMagicLevel || 0
        magicLevel += character.slot5Item?.bonusMagicLevel || 0
        magicLevel += character.slot6Item?.bonusMagicLevel || 0
        return magicLevel
    }
    
    static getCharacterDamage(character: Character, huntStyleFactor: number): number {
        /* (0.085*{D}*{X}*{Y})+({L}/5)
            X = Ataque da arma
            Y = Skills do jogador
            L = Level do jogador
            D = Fator de dano (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
        */
        let minDamage = 0;
        let maxDamage = 0;
        let attack = this.getCharacterAttack(character);
        let skill = this.getCharacterSkill(character);
        if (skill === 0) {
            //skill = 0 indica dano magico de wands e rods e o dano será consistente, variando em 10% para mais ou para menos
            maxDamage = attack*1.1;
            minDamage = attack*0.9;
        } else {
            let damageFactor = this.getCharacterDamageFactor(character);
            maxDamage = Math.round((damageFactor*huntStyleFactor*attack*skill)+(character.level/5));
        }
        return this.getRoundedRandomInRange(minDamage, maxDamage);
    }

    static getArmor(min: number, max: number): number {
        /*  
            Armadura mínima (ArmaduraTotal * 0.475)
            Armadura Máxima ((ArmaduraTotal * 0.95) - 1)
        */
        let minArmor = Math.round(min*0.475)
        let maxArmor = Math.round(max*0.95-1)
        return this.getRandomInRange(minArmor, maxArmor);
    }

    static takeDamage(damage: number, def: number, shield: number, armor: number, reduction: number): number {
        /* {A}-({B}*{D})/({E}*100)-({A}/100)*{C}
            A = ataque da criatura
            B = defesa total
            C = armadura total
            D = shielding
            E = fator de defesa  (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
        */
        let damageAfterDefAndArmor = Math.max(0,Math.round(damage-(def*shield)/(1*100)-(damage/100)*armor))
        return Math.max(0,Math.round(damageAfterDefAndArmor*(reduction/100)))
    }

    static getRandomCreatureSpell(creature: Creature): CreatureDamage {
        if (creature.damages?.length > 0) {
            let castSpellChance = (creature.damages.length/10) + 0.3; //10% chance de causar dano extra para cada damage extra no array + 30% base
            const randomValue = Math.random();
            let shouldCastSpell = randomValue <= castSpellChance;
            if (shouldCastSpell) {
                let selectedSpell = this.getRoundedRandomInRange(0, creature.damages.length-1)
                return creature.damages[selectedSpell]
            }            
        }
        return null;
    }

    static getCreatureResistence(creature: Creature, element: string): number {
        let resistence = 100; // Ex: 100 = 0% de redução, dano normal / 80 = 20% de redução de dano / 120 = 20% de aumento no dano
        switch (element) {
            case 'fire':
                resistence = creature.fireResistance
                break;
            case 'ice':
                resistence = creature.iceResistance
                break;
            case 'earth':
                resistence = creature.earthResistance
                break;
            case 'energy':
                resistence = creature.energyResistance
                break;
            case 'death':
                resistence = creature.deathResistance
                break;
            case 'holy':
                resistence = creature.holyResistance
                break;
            case 'physical':
                resistence = creature.physicalResistance
                break;
            default:
                break;
        }
        return resistence;
    }

    static getCharacterResistence(character: Character, element: string): number {
        let resistence = 100; // Ex: 100 = 0% de redução, dano normal / 80 = 20% de redução de dano / 120 = 20% de aumento no dano
        resistence -= character.slotAmulet ? this.getItemResistence(character.slotAmulet, element) : 0
        resistence -= character.slot1Item ? this.getItemResistence(character.slot1Item, element) : 0
        resistence -= character.slot2Item ? this.getItemResistence(character.slot2Item, element) : 0
        resistence -= character.slot3Item ? this.getItemResistence(character.slot3Item, element) : 0
        resistence -= character.slot4Item ? this.getItemResistence(character.slot4Item, element) : 0
        resistence -= character.slotRing ? this.getItemResistence(character.slotRing, element) : 0
        resistence -= character.slot5Item ? this.getItemResistence(character.slot5Item, element) : 0
        resistence -= character.slot6Item ? this.getItemResistence(character.slot6Item, element) : 0
        return resistence;
    }

    static getItemResistence(item: Item, element: string): number {
        let resistence = 0;
        switch (element) {
            case 'fire':
                resistence = item?.fireResistance || 0
                break;
            case 'ice':
                resistence = item?.iceResistance || 0
                break;
            case 'earth':
                resistence = item?.earthResistance || 0
                break;
            case 'energy':
                resistence = item?.energyResistance || 0
                break;
            case 'death':
                resistence = item?.deathResistance || 0
                break;
            case 'holy':
                resistence = item?.holyResistance || 0
                break;
            case 'physical':
                resistence = item?.physicalResistance || 0
                break;
            default:
                break;
        }
        return resistence;
    }

    static getCharacterBonusHealLife(character: Character): number {
        let quantity = 0;
        quantity += character.slotAmulet?.countHealing || 0
        quantity += character.slot1Item?.countHealing || 0
        quantity += character.slot2Item?.countHealing || 0
        quantity += character.slot3Item?.countHealing || 0
        quantity += character.slot4Item?.countHealing || 0
        quantity += character.slotRing?.countHealing || 0
        quantity += character.slot5Item?.countHealing || 0
        quantity += character.slot6Item?.countHealing || 0
        return quantity
    }

    static getCharacterBonusHealMana(character: Character): number {
        let quantity = 0;
        quantity += character.slotAmulet?.countMana || 0
        quantity += character.slot1Item?.countMana || 0
        quantity += character.slot2Item?.countMana || 0
        quantity += character.slot3Item?.countMana || 0
        quantity += character.slot4Item?.countMana || 0
        quantity += character.slotRing?.countMana || 0
        quantity += character.slot5Item?.countMana || 0
        quantity += character.slot6Item?.countMana || 0
        return quantity
    }

    //TODO implementar colar e anel
    //TODO implementar bonus de skill
}