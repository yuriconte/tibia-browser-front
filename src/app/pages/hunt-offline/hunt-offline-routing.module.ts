import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HuntOfflineComponent } from './hunt-offline.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HuntOfflineComponent }
    ])],
    exports: [RouterModule]
})
export class HuntOfflineRoutingModule { }
