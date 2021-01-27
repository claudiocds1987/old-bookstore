import { Component, OnInit } from '@angular/core';
// PARA OBTENER EL ID de la orden ENVIADO EN LA URL DESDE user-purchases.component.html al pulsar boton "detalle"
import { ActivatedRoute, Params } from '@angular/router';

import { OrderDetailService } from '../../../services/order-detail.service';
import { BookService } from '../../../services/book.service';
import { OrderDetail } from '../../../models/orderDetail';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  orderDetailArray: OrderDetail[] = []; // array de tipo orderDetail
  bookArray: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    public orderDetailService: OrderDetailService,
    public bookService: BookService
  ) { }

  ngOnInit(): void {
    // obtengo el idOrder que viene como parametro en la url
    this.route.params.subscribe((params: Params) => {
      // params.IdOrder porque en app-routing.mdoule.ts el parametro esta declarado como idOrder
      console.log('idOrder recibido: ' + params.idOrder);
      const idOrder = params.idOrder;
      // obtengo el detlle de la orden
      this.orderDetailService.getOrderDetail(idOrder).subscribe(
        res => {
          this.orderDetailArray = res;
          // recorro el array
          this.orderDetailArray.forEach(element => {
            const idBook = element.id_product.toString();
            //Obtengo el libro
            this.getBookById(idBook);
          })        
        },
        err => console.error('error al obtener el order_detail ' + err)
      );
    });
  }

  getBookById(idBook: string){
      this.bookService.getBookById(idBook).subscribe(
        res => {
         this.bookArray.push(...res);
        },
        err => console.error('error al intentar obtener el libro por id ' + err)
      );
  }

  linkImg(urlImage) {
    // quito la palabra public
    let str = urlImage.replace(/public/g, '');
    // quito la barra '\'
    str = str.replace('\\', '');
    // invierto la barra en sentido a '/'
    str = str.replace('\\', '/');
    // console.log(str);
    const URL = 'http://localhost:4000/';
    const link = URL + str;
    // console.log(link);
    return link;
  }

}
