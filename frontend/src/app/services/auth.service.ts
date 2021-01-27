import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './../services/token.service';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:4000/admin/login';
  private AUTH_USER = 'http://localhost:4000/api/auth/'; // para signup y login de user

  public username = new BehaviorSubject<string>('');
  public username$ = this.username.asObservable();

  constructor(private http: HttpClient, private tokenService:TokenService) { }

  getAdmin(email: string, pass: string) {
    const state: boolean = true;
    // console.log(state, email, pass);
    return this.http.post<Admin[]>(this.API, {email, pass, state});
  }

  // registro de usuario
  userSignup(user: User){
    //return this.http.post(`${this.AUTH_USER}${'signup/user'}`, user); 
    return this.http.post('http://localhost:4000/api/auth/signup/user', user);
  }

  loginUser(username: string, password){
    return this.http.post(`${this.AUTH_USER}${'signin/user'}`, {username, password})
    .pipe(
      tap((data: any) => {
        const token = data.token;
        console.log('se guardo el token');
        // aca hacer la variable usernname$ como cart$ en cart.service
        const name = data.username;
        this.username.next(name);
         // guardo el username en localStorage para ser invocada en component main-nav
         localStorage.setItem('username', name);      
        ///
        this.tokenService.saveToken(token);
      })
    )
  }

}
