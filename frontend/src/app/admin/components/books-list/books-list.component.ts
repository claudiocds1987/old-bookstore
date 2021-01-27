import { Component, OnInit } from '@angular/core';
import { BookService } from './../../../services/book.service';
import { MyValidationsService } from './../../../services/my-validations.service';
import { AuthorService } from './../../../services/author.service';
import { Book } from 'src/app/models/book';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Author } from 'src/app/models/author';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit { 
  inputValue;
  // declaro como "any" porque bookService.getOneBookWithAuthorName() devuelve un campo autors.name as "Autor"
  // entonces si desde el html quiero mostrar esa propiedad si es de tipo Book no la va a reconocer
  bookList: any[];
  radioValue;
  authorArray: Author[] = [];
  filterArray: any[] = [];
  btnDisabled: boolean = true;

  constructor(
    public bookService: BookService,
    public myValidationsService: MyValidationsService,
    public authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.getBooksWithAuthorName();
  }

  getBooksWithAuthorName() {
    this.btnDisabled = true; //deshabilita el btn listar todos
    this.inputValue = '';
    this.bookService.getBooksWithAuthorName()
      .subscribe(
        res => {
          this.bookList = res;
          this.filterArray = res;
        }
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
    console.log(link);
    return link;
  }

  filter() {
    if(!this.inputValue){
      alert("Debe escribir algo para realizar el filtrado!")
    }
    else{
      if (this.radioValue === 'id' || this.radioValue === 'name' || this.radioValue === 'author') {
        this.btnDisabled = false; // habilita el btn listar todos
        // si el input radio id is checked
        if (this.radioValue === 'id') {
          // pongo vacio el array filterArray
          this.filterArray = [];
          const id = parseInt(this.inputValue);
          //this.bookList = this.bookList.filter(item => item.id_book === id);
          this.filterArray.push(...this.bookList.filter(item => item.id_book === id));
        }
        // si el input radio name is checked
        else if (this.radioValue === 'name') {
          this.filterArray = []; // pongo vacio el array filterArray
          const name = this.myValidationsService.textCapitalize(this.inputValue);
          // no se como hacer para buscar coincidencias con .filter por eso utilizo el servicio
          this.bookService.filterBooksByName(name).subscribe(
            res => {
              this.filterArray = res;
            },
            err => console.error('Error al intentar filtrar el libro por nombre ' + err)
          );
        }
        // si el input radio author is checked
        else if (this.radioValue === 'author') {
          this.filterArray = [];  // pongo vacio el array filterArray
          const authorName = this.myValidationsService.textCapitalize(this.inputValue);
          // busco coincidencias ej: si authorName es "Pig" => (devuelve) Felipe Pigna
          this.authorService.filterAuthorsByName(authorName).subscribe(
            res => {
              this.authorArray = res; // guardo autores que hicieron match con la coincidencia
              for (const author of this.authorArray) {
                const id = this.authorArray[0].id_author;
                // guardo en filterArray todos los libros cuyos autores estan en autorArray
                this.filterArray.push(...this.bookList.filter(item => item.id_author === id))
              }
            },
            err => console.error('No se pudo filtrar el autor. ' + err)
          );
        }
      }
      // si no se selecciono ningun radio button
      else {
        alert('Elija una opcion para hacer el filtrado')
      }
    }   
  }


}
