import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorService } from './../../../services/author.service';
import { Author } from './../../../models/author';
import { NgForm } from '@angular/forms';
import { MyValidationsService } from './../../../services/my-validations.service';

@Component({
  selector: 'app-author-panel',
  templateUrl: './author-panel.component.html',
  styleUrls: ['./author-panel.component.scss']
})
export class AuthorPanelComponent implements OnInit {

  authorList$: Observable<Author[]>;
  authorArray: Author[]; // array de tipo User
  author = {} as Author; // declaro un objeto
  authorEdit = {} as Author;
  inputValueSearch: string;
  editInputValue: string;
  authorValue: string;
  editing = false;

  constructor(
    public authorService: AuthorService,
    public myValidationsService: MyValidationsService
    ) { }

  ngOnInit(): void {
    // this.authorList$ = this.authorService.getAuthors();
    this.getAuthors();
  }

  createAuthor(form: NgForm){
    if (form.value.name){
      if (confirm('¿Esta seguro/a que desea agregar el autor ' + form.value.name)){
        // cambio la 1er letra de la palabra a mayusucula 
        this.author.name = this.myValidationsService.textCapitalize(form.value.name);
        console.log('nombre de autor: ' + this.author.name);
        // aca checkear si ya existe el autor
        this.authorService.existAuthorByName(this.author.name).subscribe(
          resp => {
            if (resp === false){
              this.authorService.createAuthor(this.author).subscribe(
                res => {
                  console.log('autor guardado: ' + res);
                  alert('el autor fue guardado exitosamente');
                  // vuelvo a listar todos los autores
                  this.getAuthors();
                  form.resetForm();
                },
                err => console.error('el autor no se pudo guardar ' +  err)
              );
            }
            else{
              alert('Ya existe un autor con el mismo nombre en la base de datos');
            }
          },
          err => alert('Error, no se pudo comprobar si el author ya existe en la base de datos')
        );
      }
    }
    else{
      alert('el nombre no puede estar vacio');
    }
  }

  getAuthors(){
    this.inputValueSearch = '';
    this.authorService.getAuthors().subscribe(
      res => {
        this.authorService.authorArray = res;
      },
      err => console.error(err)
    );
  }

  getAuthorByName() {
    const name = this.myValidationsService.textCapitalize(this.inputValueSearch);
    this.authorService.getAuthorByName(name).subscribe(
      res => {
        console.log('el autor es: ' + res);
        this.authorService.authorArray = res;
      },
      err => console.error('No se pudo obtener el autor: ' + err) // si hay error, mostralo en consola
    );

  }

  editAuthor(event, id){
    this.editing = !this.editing;
    this.authorEdit.id_author = id;
  }

  updateAuthor(form: NgForm){
    if (this.authorEdit.name === undefined || this.authorEdit.name === ''){
      alert('Escriba el nombre del autor para actualizar');
    }
    else if (this.authorEdit.name.length > 50){
      alert('El nombre de autor no puede tener mas de 50 caracteres');
    }
    else if (this.authorEdit.id_author == null){
      alert('error, no esta el id de autor para poder actualizar');
    }
    else{
      if (confirm('¿Esta seguro/a que desea actualizar el autor?')){
        this.authorEdit.name = this.myValidationsService.textCapitalize(this.authorEdit.name);
        this.authorService.updateAuthor(this.authorEdit).subscribe(
          res => {
            this.getAuthors(); // listar todos los autores
            this.authorEdit = {} as Author; // limpio el objeto
            this.editing = false;
          },
          err => console.error('No se pudo actualizar el author ' + err)
        );
        alert('Author actualizado!');
        // valido si existe el nombre de autor en la db
        // this.authorService.existAuthorByName(this.authorEdit.name).subscribe(
        //   resp => {
        //     if (resp === false){
        //       this.authorService.updateAuthor(this.authorEdit).subscribe(
        //         res => {
        //           this.getAuthors(); // listar todos los autores
        //           this.authorEdit = {} as Author; // limpio el objeto
        //           this.editing = false;
        //         },
        //         err => console.error('No se pudo actualizar el author ' + err)
        //       );
        //       alert('Author actualizado!');
        //     }
        //     else{
        //       alert('El nombre de author ya existe en la base de datos');
        //     }
        //   },
        //   err => alert('No se pudo actualizar, hubo un error en la base de datos')
        // );
      }
    }
  }

  cleanUnnecessaryWhiteSpaces(cadena: string){
    // return cadena.replace(/\s{2,}/g, ' ').trim();
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }



}
