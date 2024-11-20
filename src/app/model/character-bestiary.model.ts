import { Bestiary } from "./bestiary.model";

export class CharacterBestiary {
    id:number;
    characterId:number;
    bestiaryId:number;
    bestiary: Bestiary;
    totalKills:number;
    expHour:number;

    expHourNum:number;
    expHourStr:string;
    expHourOrigStr:string;
}