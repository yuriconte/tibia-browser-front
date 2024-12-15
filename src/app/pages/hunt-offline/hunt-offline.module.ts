import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HuntOfflineComponent } from './hunt-offline.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { HuntOfflineRoutingModule } from './hunt-offline-routing.module';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [HuntOfflineComponent],
  imports: [
    PanelModule,
    HuntOfflineRoutingModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    MessagesModule,
    TableModule,
    ChartModule,
    InputTextModule,
    RatingModule,
    ProgressBarModule,
    TagModule,
    SelectButtonModule,
    ToggleButtonModule,
    InputNumberModule,
    ToastModule,
    ChipModule,
    TooltipModule,
    BadgeModule,
    CardModule,
    SelectButtonModule
  ]
})
export class HuntOfflineModule { }
