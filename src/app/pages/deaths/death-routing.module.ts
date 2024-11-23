import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeathComponent } from './death.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DeathComponent }
    ])],
    exports: [RouterModule]
})
export class DeathRoutingModule { }
