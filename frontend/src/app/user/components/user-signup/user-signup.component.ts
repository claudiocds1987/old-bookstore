import { Component, OnInit } from '@angular/core';
import { MyValidationsService } from './../../../services/my-validations.service';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { AlertService } from './../../../services/alert.service';
import { Router } from '@angular/router';
// formuluario
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  usernameClean = '';
  // form: FormGroup;
  password2 = '';
  user = {} as User;
  // fecha local
  currentDate = new Date();
  message: string;

  constructor(
    private formBuilder: FormBuilder,
    public myValidationsService: MyValidationsService,
    public authService: AuthService,
    public userService: UserService,
    public alertService: AlertService,
    private router: Router
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }
  // convenienza getter para facil acceso a lo campos del formulario 
  get f() {
    return this.form.controls;
  }

  deleteWhiteSpace(cadena: string) {
    // return cadena.replace(/\s{2,}/g, ' ').trim();
    const a = this.myValidationsService.deleteWhiteSpice(cadena);
    return a;
  }

  signUp(event: Event) {
    event.preventDefault();
    this.submitted = true;
    if (this.form.valid) {
      // obtengo todos los valores del formulario
      this.user = this.form.value;
      this.user.username = this.usernameClean;
      this.user.registration_date = this.currentDate;
      this.user.pass = this.form.value['password'];
      // check si username existe en la db.
      this.userService.existUsername(this.user.username).subscribe(
        resp => {
          if(resp === true){
            this.alertService.showWarning('Ya existe un usuario con el mismo nombre de usuario', '');
            this.message = 'Ya existe un usuario con este nombre de usuario';
          }
          else{
            // check si email existe en la db.
            this.userService.existUserEmail(this.user.email).subscribe(
              resp => {
                if(resp === true){
                  this.alertService.showWarning('Ya existe un usuario con el mismo email', '');
                  this.message = 'Ya existe un usuario con este email';
                }
                else{
                  // signup
                  console.log('username e email permitidos');
                  console.log('PASSWORD POR GRABAR: ' + this.user.pass);
                  this.authService.userSignup(this.user).subscribe(
                    resp => {
                      this.alertService.showSuccess('Gracias por registrarse', 'Registrado!');
                      // redirijo al login de usuario
                      this.router.navigate(['login']);  
                    },
                    err => {
                      alert('Ups error de servidor!\n\n'+ 'no se pudo hacer el registro de usuario');
                      console.error(err.message);
                    }
                  )
                }
              }
            )
          }
        }
      )     
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }


}
