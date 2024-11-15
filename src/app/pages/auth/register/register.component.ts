import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
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
export class RegisterComponent {

    charactername: string = '';
    username: string = '';
    password: string = '';
    password2: string = '';

    constructor(public layoutService: LayoutService, 
        private authService: AuthService, 
        private router: Router,
        private service: MessageService) {}


    register() {
        if (this.charactername?.trim().length > 0 && this.username?.trim().length > 0 && this.password?.trim().length > 0 && this.password2?.trim().length > 0) {
            if (this.password !== this.password2) {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "A confirmação da senha não confere!" });    
                return;
            }
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: "Preencha todos os dados necessários!" });
            return;
        }
        this.authService.register(this.username, this.password, this.charactername).subscribe({
            next: () => {
                this.router.navigate(['/hunt']);
            },
            error: (error) => {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error.message });
            }
        });
    }
    
}
