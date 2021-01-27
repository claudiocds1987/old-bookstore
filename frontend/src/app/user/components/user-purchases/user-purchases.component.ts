import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-user-purchases',
  templateUrl: './user-purchases.component.html',
  styleUrls: ['./user-purchases.component.scss']
})
export class UserPurchasesComponent implements OnInit {

  constructor(
    public orderService: OrderService,
    public userService: UserService,
    public alertService: AlertService
  ) { }

  ordersArray: Order[] = []; // array de tipo Order
  filterOrdersArray: Order[] = [];
  userArray: User[] = []; 
  date1: Date;
  date2: Date;
  btnDisabled: boolean = true;
  message = 'No se encontraron resultados'; 
 
  ngOnInit(): void {
    // localStorage 'username' fue creada en auth.service.ts funcion loginUser() cuando hizo login en user-login.component.ts
    const username = localStorage.getItem('username');
    this.getUserByUserName(username);
  }

  getUserByUserName(username: string) {
    this.userService.getUserByUserName(username)
      .subscribe(res => {
        console.log('res: ' + JSON.stringify(res));
        this.userArray = res;
        this.getOrdersByUserId(this.userArray[0].id_user);
      },
        err => console.error('Error al obtener el username en ngOnInit ' + err)
      );
  }

  getOrdersByUserId(idUser: number) {
    this.orderService.getOrdersByUserId(idUser)
      .subscribe(res => {
        this.ordersArray = res;
        this.filterOrdersArray = res;
      },
        err => console.error('No se pudo obtener las ordenes de compra del usuario ' + err)
      );
  }


  filterOrdersByDate() {
    if (this.date1 === undefined || this.date2 === undefined) {
      
      this.alertService.showWarning('Debe elegir un rango de fecha', '');
      //alert('Debe elegir un rango de fecha');
    }
    else {
      this.btnDisabled = false; // se habilita btn listar todos
      const startDate = new Date(this.date1);
      const endDate = new Date(this.date2);
      // obteniendo las ordenes por fecha en el array filterOrdersArray
      this.filterOrdersArray = this.ordersArray.filter(a => {
        const date = new Date(a.order_date);
        return date >= startDate && date <= endDate;
      })
    }
  }

  listAllOrders() {
    this.btnDisabled = true; // deshabilito btn listar todos
    this.date1 = undefined;
    this.date2 = undefined;
    this.getOrdersByUserId(this.userArray[0].id_user);
  }


}
