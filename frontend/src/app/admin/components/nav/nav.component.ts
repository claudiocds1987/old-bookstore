import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  //isMenuCollapsed = false; // para que funcione el menú desplegable
  adminEmail: string = '';
  admin = {} as Admin; // declaro un objeto Admin
  constructor() { }

  ngOnInit(): void {
    // esta sessionStorage se creó en la funcion login de admin-login.component.ts
    // tengo que utilizar JSON.parse para guardar la data de la sessionStorage en el objeto admin
    this.admin = JSON.parse(sessionStorage.getItem('adminData'));
  }

}
