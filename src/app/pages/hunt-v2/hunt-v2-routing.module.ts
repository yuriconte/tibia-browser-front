import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HuntV2Component } from './hunt-v2.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HuntV2Component }
    ])],
    exports: [RouterModule]
})
export class HuntV2RoutingModule { }
