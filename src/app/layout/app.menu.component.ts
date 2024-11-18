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
                    { label: 'Caçar Online', icon: 'pi pi-fw pi-home', routerLink: ['/hunt'] },
                    { label: 'Caçar AFK (WIP)', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Treino', icon: 'pi pi-fw pi-home', routerLink: ['/train'] },
                    { label: 'Bestiario', icon: 'pi pi-fw pi-home', routerLink: ['/bestiary'] },
                    { label: 'Quests (WIP)', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Mapa Global (WIP)', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Comunidade',
                items: [
                    { label: 'Rankings (WIP)', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Wiki',
                items: [
                    { label: 'Work In Progress', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
        ];
    }
}
