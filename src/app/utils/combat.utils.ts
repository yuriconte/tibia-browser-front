import { Character } from "../model/character.model";
import { CreatureDamage } from "../model/creature-damage.model";
import { Creature } from "../model/creature.model";

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
                    break;
                case 'axe':
                    skillValue = character.axe;
                    break;
                case 'club':
                    skillValue = character.club;
                    break;
                case 'distance':
                case 'arrow':
                case 'bolt':
                    skillValue = character.distance;
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

    static takeDamage(damage: number, def: number, shield: number, armor: number): number {
        /* {A}-({B}*{D})/({E}*100)-({A}/100)*{C}
            A = ataque da criatura
            B = defesa total
            C = armadura total
            D = shielding
            E = fator de defesa  (Full ATK = 1, Balanced = 0.75, Full Def = 0.5)
        */
        return Math.max(0,Math.round(damage-(def*shield)/(1*100)-(damage/100)*armor))
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

    //TODO implementar redução de dano
    //TODO implementar dano elemental
    //TODO implementar colar e anel
    //TODO implementar bonus de skill e de resistencia
    // static getDamageReduction(min: number, max: number): number {

    // }

}