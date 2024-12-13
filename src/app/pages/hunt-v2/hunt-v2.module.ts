import { HuntV2RoutingModule } from './hunt-v2-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HuntV2Component } from './hunt-v2.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
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
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [HuntV2Component],
  imports: [
    PanelModule,
    HuntV2RoutingModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
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
    TableModule,
    SliderModule,
    BadgeModule,
    CardModule,
    DialogModule,
    AccordionModule,
    CarouselModule
  ]
})
export class HuntV2Module { }
