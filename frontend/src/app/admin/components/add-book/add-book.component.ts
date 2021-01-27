import { Component, OnInit } from '@angular/core';
import { BookService } from './../../../services/book.service';
import { AuthorService } from './../../../services/author.service';
import { CategoryService } from './../../../services/category.service';
import { EditorialService } from './../../../services/editorial.service';
import { MyValidationsService } from './../../../services/my-validations.service';
// formuluario
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { Author } from 'src/app/models/author';
import { Category } from 'src/app/models/category';
import { Editorial } from 'src/app/models/editoral';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http'; // para imagen

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  form: FormGroup;
  selectedIdAut: string = '';
  selectedIdCat: string = '';
  selectedIdEdi: string = '';
  authorList$: Observable<Author[]>;
  categoryList$: Observable<Category[]>;
  editorialList$: Observable<Editorial[]>;
  bookList$: Observable<Book[]>;
  image$: Observable<any>;
  book = {} as Book; // declaro un objeto Book vacio, no es un array
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();
  selectedFile = null;
  imageSelected;
  // para editar el libro
  editingBook: Book;
  editing: boolean = false;
  // para hacer un preview de la img seleccionada
  imgPreview: string | ArrayBuffer;

  newId: number;

  constructor(
    public bookService: BookService,
    public authorService: AuthorService,
    public categoryService: CategoryService,
    public editorialService: EditorialService,
    private http: HttpClient,
    public myValidationsService: MyValidationsService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm(); // function buildForm
  }

  ngOnInit(): void {
    this.authorList$ = this.authorService.getAuthors();
    this.categoryList$ = this.categoryService.getCategories();
    this.editorialList$ = this.editorialService.getEditorials();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      year: ['', [Validators.required, Validators.min(1500),Validators.max(this.year)]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      editorial: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(2500)]],
      quantity: ['', [Validators.required]],
      price: [0, [Validators.required]],
      image: [''],
      state: [true]
    });
  }
  // Función que valida el formulario, y el confirm
  // LLena el objeto book, y valida si tiene imagen para cargar.
  createBook(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      if (confirm('¿Esta seguro/a que desea agregar un nuevo libro?')) {
        // obtengo todos los valores del formulario
        this.book = this.form.value;
        this.book.id_author = parseInt(this.selectedIdAut);
        this.book.id_editorial = parseInt(this.selectedIdEdi);
        this.book.id_category = parseInt(this.selectedIdCat);
        this.book.url_image = '';

        if (this.imageSelected != null) {
          // SUBO IMAGEN ////
          this.uploadImage(); // Si tiene imagen la carga
        } else {
          this.endCreateBook(); // Si no manda el formulario como va
        }
      }
    }
  }

  // Carga la imagen y cuando termina, asigna el path a la variable url_image.
  // envia el formulario al servidor
  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.imageSelected);
    // subo la imagen a nodejs
    this.http.post<any>('http://localhost:4000/file', formData).subscribe(
      (res) => {
        this.book.url_image = res.path; // guardo el path de la img
        this.endCreateBook(); // envío el formualario al servidor nodejs y espero respuesta
      },
      (err) => console.log(err)
    );
    this.cleanImgPreview(); // hago desaparecer la img preview
  }

  // Envia el formulario al servidor y espera a la respuesta.
  endCreateBook() {
    this.book.name = this.cleanUnnecessaryWhiteSpaces(this.book.name);
    // convierte solo la 1er letra de la palabra a mayúscula (capitalize)
    this.book.name = this.myValidationsService.textCapitalize(this.book.name);
    console.log('nombre de libro: ' + this.book.name + ' id autor: ' + this.book.id_author);
    // verifico si el libro a guardar ya existe en la db
    this.bookService.existBook(this.book.name, this.book.id_author).subscribe(
      res => {
        if (res === true) {
          alert('Ya existe un libro con el mismo nombre y mismo autor en la base de datos');
        }
        else {
          // guardo los datos
          this.bookService.createBook(this.book).subscribe(
            resp => {
              alert('El libro se ha guardado exitosamente ' + resp);
              // vuelvo a a traer los libros
              this.bookList$ = this.bookService.getBooksWithAuthorName();
              this.resetForm();
              this.book = {} as Book; // vuelvo a declarar objeto para ponerlo en vacio
              // this.toastr.success('Operación exitosa', 'Producto agregado!');
            },
            err => console.error('Error en db, no se pudo guardar el libro ' + err)
          );
        }
      },
      err => alert('error de db, no se pudo comprobar la existencia del libro')
    );
  }

  resetForm() {
    this.form.reset();
    console.log(this.book);
    this.book = {} as Book;
    console.log('book esta vacio' + this.book);
    // si eligió una imagen la borro
    if (this.imageSelected != null) {
      this.cleanImgPreview();
    }
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageSelected = file;
      // preview de la img
      const reader = new FileReader();
      // leo el archivo seleccionado
      reader.onload = e => this.imgPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // borro la img seleccionada en el input file
  cleanImgPreview() {
    this.imgPreview = null;
    this.form.get('image').setValue('');
    this.imageSelected = null;
  }

  cleanUnnecessaryWhiteSpaces(cadena: string) {
    // return cadena.replace(/\s{2,}/g, ' ').trim();
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }

  // captura el value del <select> autor
  captureIdAutor(event: any) {
    this.selectedIdAut = event.target.value;
    this.form.get('author').setValue(this.book.id_author, {
      onlySelf: true
    });
  }

  // captura el value del <select> categoria
  captureIdCategory(event: any) {
    this.selectedIdCat = event.target.value;
    this.form.get('category').setValue(this.book.id_category, {
      onlySelf: true
    });
  }

  // captura el value del <select> editorial
  captureIdEditorial(event: any) {
    this.selectedIdEdi = event.target.value;
    this.form.get('editorial').setValue(this.book.id_editorial, {
      onlySelf: true
    });
  }


}
