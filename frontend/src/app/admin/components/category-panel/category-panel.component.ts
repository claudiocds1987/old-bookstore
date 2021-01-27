import { Component, OnInit } from '@angular/core';
import { CategoryService } from './../../../services/category.service';
import { Category } from './../../../models/category';
import { NgForm } from '@angular/forms';
import { MyValidationsService } from './../../../services/my-validations.service';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent implements OnInit {

  authorValue: string;
  categoryArray: Category[];
  editing = false;
  inputValueSearch: string;
  categoryEdit = {} as Category;
  category = {} as Category;
  searchResult: boolean;

  constructor(
    public categoryService: CategoryService,
    public myValidationsService: MyValidationsService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.searchResult = true;
    this.inputValueSearch = '';
    this.categoryService.getCategories().subscribe(
      res => {
        this.categoryArray = res;
      },
      err => console.error('Error, no se pudo obtener todas las categorias' + err)
    );
  }

  createCategory(form: NgForm) {
    if (this.category.name) {
      this.category.name = this.myValidationsService.textCapitalize(this.category.name);
      this.categoryService.existCategoryName(this.category.name).subscribe(
        res => {
          if (res === false) {
            if (confirm('¿Esta seguro/a que desea agregar la categoria: ' + this.category.name + '?')) {
              this.categoryService.createCategory(this.category).subscribe(
                resp => {
                  alert('Se insertó una nueva categoria');
                  this.getCategories();
                  form.resetForm();
                },
                err => console.error('No se pudo insertar una nueva categoria ' + err)
              );
            }
          }
          else {
            alert('Ya existe una categoria con ese nombre');
            this.category.name = '';
          }
        },
        err => console.error('No se pudo obtener la categoria por nombre ' + err)
      );

    }
    else {
      alert('Escriba un nombre de categoria para poder agregarla');
    }
  }

  editCategory(event, id) {
    // !this.editing, porque si esta en false cambia a true y viceversa
    this.editing = !this.editing;
    this.categoryEdit.id_category = id;
  }

  updateCategory(form: NgForm) {
    if (this.categoryEdit.name === undefined || this.categoryEdit.name === '') {
      alert('escriba el nombre de la categoria para actualizar');
    }
    else if (this.categoryEdit.name.length > 25) {
      alert('El nombre de categoria no puede tener mas de 25 caracteres');
    }
    else if (this.categoryEdit.id_category == null) {
      alert('error, no esta el id de categoria para poder actualizar');
    }
    else {
      this.categoryEdit.name = this.myValidationsService.textCapitalize(this.categoryEdit.name);
      if (confirm('¿Esta seguro/a que desea actualizar la categoria?')) {
        this.categoryService.updateCategory(this.categoryEdit).subscribe(
          res => {
            this.editing = false;
            this.getCategories(); // lista toda las categorias
            this.categoryEdit = {} as Category; // limpio el objeto
          },
          err => alert('Error en el servicio o en la base de datos. No se pudo actualizar la categoria ' + err)
        );
        alert('La categoria ah sido actualizada');
      }
    }
  }

  getCategoryByName() {
    if (this.inputValueSearch) {
      if(this.inputValueSearch.length <= 25){
        const name = this.myValidationsService.textCapitalize(this.inputValueSearch);
        this.categoryService.getCategoryByName(name).subscribe(
          res => {
            if (res.length === 0) {
              this.searchResult = false;
            }
            else {
              this.searchResult = true;
              this.categoryArray = res;
            }
          },
          err => console.error('No se pudo obtener la categoria ' + err)
        );
      }
      else{
        alert('El nombre de la categoria no puede superar mas de 25 caracteres')
      }
     
    }
    else {
      alert('Ingrese el nombre de la categoria para hacer la búsqueda');
    }
  }

  cleanUnnecessaryWhiteSpaces(cadena: string) {
    // return cadena.replace(/\s{2,}/g, ' ').trim();
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }

}
