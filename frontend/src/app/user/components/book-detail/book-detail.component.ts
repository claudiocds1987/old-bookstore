import { Component, OnInit } from '@angular/core';
// PARA OBTENER EL ID de book ENVIADO EN LA URL DESDE home.component.html al clickear el titulo del libro
import { ActivatedRoute, Params } from '@angular/router';
import { Book } from 'src/app/models/book';
// servicios
import { BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  book = {} as Book; //objeto book
  autorName;
  editorialName;
  categoryName;
  urlImgDirty;
  

  constructor(
    private route: ActivatedRoute,
    public bookService: BookService,
    public cartService: CartService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // params.IdBook porque en app-routing.mdoule.ts el parametro esta declarado como idBook
      console.log('idBook recibido: ' + params.idBook);
      this.bookService.getRealDataBook(params.idBook).subscribe(
        res => {      
          //****************************************************
          this.book.description = res[0].description;
          this.book.id_author = res[0].id_author;
          this.book.id_book = res[0].id_book;
          this.book.id_category = res[0].id_category;
          this.book.id_editorial = res[0].id_editorial;
          this.book.name = res[0].name;
          this.book.price = res[0].price;
          this.book.quantity = res[0].quantity;
          this.book.state = res[0].state;
          this.urlImgDirty = res[0].url_image;
          this.book.url_image = this.linkImg(res[0].url_image);
          //this.book.url_image = res[0].url_image;
          this.book.year = res[0].year;
          this.autorName = res[0].autor;
          this.editorialName = res[0].editorial;
          this.categoryName = res[0].category;
          //****************************************************

        },
        err => console.error('Error al intentar obtener el libro por id ' + err)
      );
    });
  }

  linkImg(urlImage) {
    console.log('img sin procesar: ' + urlImage)
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

  addShoppingCart(book: Book) {
    // // ojo con la imagen cuando guardas el book ya que la url_img esta limpia ? 
    // // y en order_detail vuelve a limpiarla os ea le saca public/ puede que no t la muestre en order detail
    let idBookArray = [];
    //let items = [];
    let exist = false;
    // existe la localStorageStorage ?
    if (localStorage.getItem('idBooks') != null) {
      // Obtiene la información almacenada desde localStorage
      const items = JSON.parse(localStorage.getItem('idBooks'));
      // guardo el contenido de la localStorage en array
      for (const id of items) {
        // aca por ej si el id grabado fue 14, en vez de mostrar "14" muestra 1 y despues 4
        console.log('id: ' + id)
        idBookArray = [...idBookArray, id];
      }
      // checkeo si el nuevo producto ya existe en el carrito
      for (const item of items) {
        if (book.id_book.toString() === item.toString()) {
          exist = true;
        }
      }
      if (exist) {
        this.alertService.showWarning('El producto ya esta agregado al carrito', '')
      }
      else {
        // guardo en array el nuevo proucto
        idBookArray = [...idBookArray, book.id_book];
        // grabo array actualizado en localStorage
        localStorage.setItem('idBooks', JSON.stringify(idBookArray));
        // guardo el libro en el carrito
        //this.book.url_image = this.urlImgDirty;
        this.cartService.addCart(book);
        this.alertService.showSuccess('Producto agregado al carrito', '');
      }
    }
    else {  
      idBookArray = [...idBookArray, book.id_book];
      // 1er carga del producto y creo la localStorage
      localStorage.setItem('idBooks', JSON.stringify(idBookArray));
      // guardo el libro en el carrito
      this.cartService.addCart(book);
      this.alertService.showSuccess('Producto agregado al carrito', '');
    }
    
  }

}
