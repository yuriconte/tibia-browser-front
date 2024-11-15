import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string, remember: boolean){
    return this.httpClient.post<any>(this.apiUrl + "/login", { username, password }).pipe(
      tap((value) => {
        if (remember) {
          //salva no storage do navegador, quando fechar a tela não precisará logar novamente na próxima
          localStorage.setItem("username", value.username)
          localStorage.setItem("token", value.token)
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('token');
        }
        //salva apenas na sessão, quando fechar a tela terá que logar novamente na próxima
        sessionStorage.setItem("username", value.username)
        sessionStorage.setItem("token", value.token)
        return true;
      }),
      catchError((error) => {
        if (error.status === 403) {
          return throwError(() => new Error('Acesso negado: credenciais incorretas.')); 
        } else {
          return throwError(() => new Error('Erro ao realizar login. Tente novamente mais tarde.')); 
        }
      })
    )
  }

  register(username: string, password: string, charactername: string){
    return this.httpClient.post<any>(this.apiUrl + "/register", { username, password, charactername }).pipe(
      tap((value) => {
        sessionStorage.setItem("username", value.username)
        sessionStorage.setItem("token", value.token)
      }),
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => new Error('Nome de Usuário ou Personagem já existe.')); 
        } else {
          return throwError(() => new Error('Erro ao realizar registro. Tente novamente mais tarde.')); 
        }
      })
    )
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');

  }

  isLoggedIn(): boolean {
    // Verifica o estado de autenticação no sessionStorage ao iniciar
    let isAuthenticated = sessionStorage.getItem('token')?.length > 0;
    if (!isAuthenticated) {
      // Verifica o estado de autenticação no localStorage ao iniciar
      isAuthenticated = localStorage.getItem('token')?.length > 0;
    }
    return isAuthenticated;
  }

  getUser(): string {
    let username = sessionStorage.getItem('username');
    if (username?.length > 0) {
      return username;
    }
    username = localStorage.getItem('username');
    if (username?.length > 0) {
      return username;
    }
    return null;
  }
}
