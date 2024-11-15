import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton' ;
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        PerfilRoutingModule,
        PanelModule,
        TableModule,
        ProgressBarModule,
        ChipModule,
        TooltipModule,
        ButtonModule,
        SplitButtonModule,
        ConfirmPopupModule,
        ToastModule
    ],
    declarations: [PerfilComponent]
})
export class PerfilModule { }
