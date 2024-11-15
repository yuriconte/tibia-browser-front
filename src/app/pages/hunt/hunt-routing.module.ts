import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HuntComponent } from './hunt.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HuntComponent }
    ])],
    exports: [RouterModule]
})
export class HuntRoutingModule { }
