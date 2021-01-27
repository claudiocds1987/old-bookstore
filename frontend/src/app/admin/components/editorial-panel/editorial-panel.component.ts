import { Component, OnInit } from '@angular/core';
import { EditorialService } from './../../../services/editorial.service';
import { Editorial } from './../../../models/editoral';
import { NgForm } from '@angular/forms';
import { MyValidationsService } from './../../../services/my-validations.service';

@Component({
  selector: 'app-editorial-panel',
  templateUrl: './editorial-panel.component.html',
  styleUrls: ['./editorial-panel.component.scss']
})
export class EditorialPanelComponent implements OnInit {

  // authorValue: string;
  editorialArray: Editorial[];
  editing = false;
  inputValueSearch: string;
  editorialEdit = {} as Editorial;
  editorial = {} as Editorial;
  searchResult: boolean;

  constructor(
    public editorialService: EditorialService,
    public myValidationsService: MyValidationsService
  ) { }

  ngOnInit(): void {
    this.getEditorials();
  }

  getEditorials() {
    this.searchResult = true;
    this.inputValueSearch = '';
    this.editorialService.getEditorials().subscribe(
      res => {
        this.editorialArray = res;
      },
      err => console.error('Error, no se pudo obtener todas las editoriales' + err)
    );
  }

  createEditorial(form: NgForm) {
    if (this.editorial.name) {
      this.editorial.name = this.myValidationsService.textCapitalize(this.editorial.name);
      // verifico si la editorial ya existe en la db
      this.editorialService.existEditorialByName(this.editorial.name).subscribe(
        res => {
          if (res === false) {
            if (confirm('¿Esta seguro/a que desea agregar la editorial: ' + this.editorial.name + '?')) {
              this.editorialService.createEditorial(this.editorial).subscribe(
                resp => {
                  alert('Se insertó una nueva editorial');
                  this.getEditorials();
                  form.resetForm();
                },
                err => console.error('No se pudo insertar una nueva editorial ' + err)
              );
            }
          }
          else {
            alert('Ya existe una editorial con ese nombre');
            this.editorial.name = '';
          }
        },
        err => console.error('No se pudo obtener la editorial por nombre ' + err)
      );

    }
    else {
      alert('Escriba un nombre de categoria para poder agregarla');
    }
  }

  editEditorial(event, id) {
    // !this.editing, porque si esta en false cambia a true y viceversa
    this.editing = !this.editing;
    this.editorialEdit.id_editorial = id;
  }

  updateEditorial(form: NgForm) {
    if (this.editorialEdit.name === undefined || this.editorialEdit.name === '') {
      alert('escriba el nombre de la editorial para actualizar');
    }
    else if (this.editorialEdit.name.length > 50) {
      alert('El nombre de editorial no puede tener mas de 50 caracteres');
    }
    else if (this.editorialEdit.id_editorial == null) {
      alert('error, no esta el id de editorial para poder actualizar');
    }
    else {
      this.editorialEdit.name = this.myValidationsService.textCapitalize(this.editorialEdit.name);
      if (confirm('¿Esta seguro/a que desea actualizar la editorial?')) {
        this.editorialService.updateEditorial(this.editorialEdit).subscribe(
          res => {
            this.editing = false;
            this.getEditorials(); // lista toda las editoriales
            this.editorialEdit = {} as Editorial; // limpio el objeto
          },
          err => console.error('No se pudo actualizar la editorial ' + err)
        );
        alert('La editorial ah sido actualizada');
      }
    }
  }

  getEditorialByName() {
    if (this.inputValueSearch) {
      this.editorialService.getEditorialByName(this.inputValueSearch).subscribe(
        res => {
          if (res.length === 0) {
            this.searchResult = false;
          }
          else {
            this.searchResult = true;
            this.editorialArray = res;
          }
        },
        err => console.error('No se pudo obtener la categoria ' + err)
      );
    }
    else {
      alert('Ingrese el nombre de la categoria para hacer la búsqueda');
    }
  }

  cleanUnnecessaryWhiteSpaces(cadena: string) {
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }


}
