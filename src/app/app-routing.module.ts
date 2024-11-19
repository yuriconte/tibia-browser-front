import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './pages/auth/auth.guard';
import { AccessComponent } from './pages/auth/access/access.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'hunt',
                pathMatch: 'full'
            },
            {
                path: '', component: AppLayoutComponent,
                canActivate: [AuthGuard],  // Aplica o guard a todas as rotas filhas
                children: [
                    { path: 'hunt', loadChildren: () => import('./pages/hunt/hunt.module').then(m => m.HuntModule) },
                    { path: 'train', loadChildren: () => import('./pages/train/train.module').then(m => m.TrainModule) },
                    { path: 'bestiary', loadChildren: () => import('./pages/bestiary/bestiary.module').then(m => m.BestiaryModule) },
                    { path: 'ranking', loadChildren: () => import('./pages/ranking/ranking.module').then(m => m.RankingModule) },
                    { path: 'perfil', loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
            { path: 'access-denied', component: AccessComponent },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
