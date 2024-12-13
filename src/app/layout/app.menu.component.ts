import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Seu Personagem',
                items: [
                    { label: 'Caçar Online',  routerLink: ['/hunt'] },
                    { label: 'Caçar Online V2 (Teste)',  routerLink: ['/hunt-v2'] },
                    { label: 'Caçar Offline',  routerLink: ['/hunt-offline'] },
                    { label: 'Treino',  routerLink: ['/train'] },
                    { label: 'Quests',  routerLink: ['/quest'] },
                    { label: 'Bestiario',  routerLink: ['/bestiary'] },
                    { label: 'Loja',  routerLink: ['/shop'] },
                    { label: 'Outfit (Teste)',  routerLink: ['/outfitter'] },
                ]
            },
            {
                label: 'Comunidade',
                items: [
                    { label: 'Rankings',  routerLink: ['/ranking'] },
                    { label: 'Últimas Mortes',  routerLink: ['/death'] }
                ]
            },
            {
                label: 'Wiki',
                items: [
                    { label: 'Work In Progress (WIP)',  routerLink: ['/'] }
                ]
            }
        ];
    }
}
