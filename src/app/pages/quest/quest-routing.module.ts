import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestComponent } from './quest.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: QuestComponent }
    ])],
    exports: [RouterModule]
})
export class QuestRoutingModule { }
