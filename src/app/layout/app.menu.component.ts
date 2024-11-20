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
                    { label: 'Caçar AFK (WIP)',  routerLink: ['/'] },
                    { label: 'Treino',  routerLink: ['/train'] },
                    { label: 'Bestiario',  routerLink: ['/bestiary'] },
                    { label: 'Loja',  routerLink: ['/shop'] },
                    { label: 'Quests (WIP)',  routerLink: ['/'] },
                    { label: 'Mapa Global (WIP)',  routerLink: ['/'] }
                ]
            },
            {
                label: 'Comunidade',
                items: [
                    { label: 'Rankings',  routerLink: ['/ranking'] }
                ]
            },
            {
                label: 'Wiki',
                items: [
                    { label: 'Work In Progress',  routerLink: ['/'] }
                ]
            }
        ];
    }
}
