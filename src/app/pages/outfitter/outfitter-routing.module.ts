import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OutfitterComponent } from './outfitter.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OutfitterComponent }
    ])],
    exports: [RouterModule]
})
export class OutfitterRoutingModule { }
