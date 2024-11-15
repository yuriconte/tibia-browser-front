import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {

    username: string = '';
    password: string = '';
    remember: boolean = false;

    constructor(public layoutService: LayoutService, 
        private authService: AuthService, 
        private router: Router,
        private service: MessageService) {}


    login() {
        this.authService.login(this.username, this.password, this.remember).subscribe({
            next: () => {
                this.router.navigate(['/hunt']);
            },
            error: (error) => {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error.message });
            }
        });
    }
    
}
