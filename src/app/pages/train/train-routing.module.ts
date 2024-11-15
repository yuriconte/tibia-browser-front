import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrainComponent } from './train.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TrainComponent }
    ])],
    exports: [RouterModule]
})
export class TrainRoutingModule { }
