import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RankingComponent } from './ranking.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RankingComponent }
    ])],
    exports: [RouterModule]
})
export class RankingRoutingModule { }
