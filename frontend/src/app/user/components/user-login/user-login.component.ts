import { Component, OnInit } from '@angular/core';
import { MyValidationsService } from './../../../services/my-validations.service';
// formuluario
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { CartService } from './../../../services/cart.service';
import { TokenService } from './../../../services/token.service';
import { AlertService } from './../../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  username: string;
  password: string;
  form: FormGroup;
  message: string;

  constructor(
    private formBuilder: FormBuilder,
    public myValidationsService: MyValidationsService,
    public authService: AuthService,
    public cartService: CartService,
    public router: Router,
    public tokenService: TokenService,
    public alertService: AlertService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    // al entrar a login, si hay un usuario logeado, hago logout borrando la locastorage
    if (localStorage.getItem('username') != null) {
      // borra el username de main-nav si no hay refresh la pagina  
      this.authService.username.next('');
      // borrando cantidad de items en el boton del carrito de main-nav si no hay refresh
      this.cartService.cart.next([]);
      // borrando las localStorage
      localStorage.removeItem('username');
      this.alertService.showInfo('Sesión cerrada', '');
      // borrando localStorage shoppingCart
      if (localStorage.getItem('shoppingCart') != null) {
        localStorage.removeItem('shoppingCart');
        console.log('localStorage del shopping cart eliminada')
      }

      // borrando la localStorage idBooks
      if (localStorage.getItem('idBooks') != null) {
        localStorage.removeItem('idBooks');
        console.log('localStorage con array de idBooks eliminada')
      }

      // borrando la localStorage token
      if (localStorage.getItem('token') != null) {
        localStorage.removeItem('token');
        console.log('localStorage con el token eliminada');
      }
    }

  }

  buildForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(15)]],
    });
  }

  cleanUnnecessaryWhiteSpaces(cadena: string) {
    // return cadena.replace(/\s{2,}/g, ' ').trim();
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }

  login(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.authService.loginUser(this.username, this.password)
        .subscribe(
          res => {
            console.log('Autorizado: ' + JSON.stringify(res.username));
            this.message = null;
            // const username = JSON.stringify(res.username);
            // console.log(username);
            this.alertService.showSuccess(`Bienvenido ${res.username}`, 'Login exitoso!');
            this.router.navigate(['home']);
          },
          err => {
            console.error('Acceso denegado ' + err.message);
            // borro localStorage
            if (localStorage.getItem('token') != null) {
              localStorage.removeItem('token');
              console.log('se borro la localStorage token');
            }
            this.alertService.showError('Nombre de usuario y/o contraseña incorrectos','');
            this.message = 'Nombre de usuario y/o contraseña incorrectos';
          }
        )

    }
  }


}
