import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BestiaryComponent } from './bestiary.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BestiaryComponent }
    ])],
    exports: [RouterModule]
})
export class BestiaryRoutingModule { }
