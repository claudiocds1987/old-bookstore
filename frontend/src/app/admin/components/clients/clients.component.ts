import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  inputValue: string;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      // la resuesta guardala en el array userArray declarado en userService
      res => {
        this.userService.userArray = res;
      },
      err => console.error(err) // si hay error, mostralo en consola
    );
  }

  getUserByUserName(form: NgForm) {
    // console.log('search: ' + form.value.search);
    this.userService.getUserByUserName(form.value.search).subscribe(
      res => {
        console.log(res);
        this.userService.userArray = res;
      },
      err => console.error(err) // si hay error, mostralo en consola
    );
  }

}
