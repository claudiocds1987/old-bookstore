import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { MyValidationsService } from '../../../services/my-validations.service';
// servicio Toastr para alerts
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bookList$: Observable<Book[]>;
  inputValue = '';
  hideButton = false;
  username: string;
  //btnDisabled: boolean = true;

  ocultar = false;
 
  constructor(
    public bookService: BookService,
    public cartService: CartService,
    public myValidationsService: MyValidationsService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    // "boton listar todos" del filtrado esta oculto hasta que se haga click en boton buscar
    document.getElementById('btn-listar-todos').style.display = 'none'; //?

    this.getBooksWithAuthorName();

    if(localStorage.getItem('username') != null){
      this.username = localStorage.getItem('username');
    }

  }

  getBooksWithAuthorName() {
    //this.bookList$ = this.bookService.getBooksWithAuthorName();
    this.bookList$ = this.bookService.getBooksWithAuthorName()
    .pipe(
      // explicacion: todo lo que hay en "bookList$"" copialo a array "books: Book[]"
      // y "mapealo (accede a sus elementos)" con la "variable book" 
      map((books: Book[]) => books.map(book => { 
        return {
          // devuelve el objeto book con la url_image limpia para verla en html        
          ...book, url_image: this.linkImg(book.url_image) 
        } 
      })        
    ));
       
    // si estaba en false cambia a true o viceversa
    this.hideButton = !this.hideButton;
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

  filterBookByName() {
    if (this.inputValue === '') {
      this.alertService.showWarning('El campo no puede estar vacio','ERROR');
    }
    else {
      // aparece el btn listar todos
      document.getElementById('btn-listar-todos').style.display = 'inline';
      //this.btnDisabled = false; // se hablita el btn listar todos
      this.bookList$ = this.bookService.filterBooksByName(this.inputValue)
      .pipe(
        // explicacion: todo lo que hay en "bookList$"" copialo a array "books: Book[]"
        // y "mapealo (accede a sus elementos)" con la "variable book" 
        map((books: Book[]) => books.map(book => { 
          return {
            // devuelve el objeto book con la url_image limpia para verla en html        
            ...book, url_image: this.linkImg(book.url_image) 
          } 
        })        
      ));
        // .pipe(
        //   catchError(error => {
        //     // manejo de error
        //     console.log('Hay un error en el servicio o en la base de datos ' + error);
        //     return of([]);
        //   })
        // );

      this.bookList$.subscribe(
        res => {
          if (res.length === 0) {
            this.alertService.showError('No se encontraron resultados', 'NO HAY MATCH');
            this.inputValue = '';
            //this.getBooksWithAuthorName();       
            this.hideButton = !this.hideButton; // si estaba en false cambia a true o viceversa
          }
        }
      );
    }
  }

  listBooks(){
    //this.btnDisabled = true; // deshabilita el btn listar todos
    // se oculta el boton listar todos
    document.getElementById('btn-listar-todos').style.display = 'none'; //?
    this.inputValue = '';
    this.getBooksWithAuthorName();
  }

  addCarrito(book: Book) {
    let idBookArray = [];
    let exist = false;
    // existe la localStorageStorage ?
    if (localStorage.getItem('idBooks') != null) {
      // Obtiene la información almacenada desde localStorage
      const items = JSON.parse(localStorage.getItem('idBooks'));
      // guardo el contenido de la localStorage en array
      for (const value of items) {
        idBookArray = [...idBookArray, value];
      }
      // checkeo si el nuevo producto ya existe en el carrito
      for (const item of idBookArray) {
        if (book.id_book.toString() === item.toString()) {
          exist = true;
        }
      }
      if (exist) {
        this.alertService.showWarning('El producto ya fue agregado al carrito!', '');
      }
      else {
        // guardo en array el nuevo proucto
        idBookArray = [...idBookArray, book.id_book];
        // grabo array actualizado en localStorage
        localStorage.setItem('idBooks', JSON.stringify(idBookArray));
        // guardo el libro en el carrito
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
