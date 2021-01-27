import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  createSale(sale: Sale){
    return this.http.post('http://localhost:4000/sales/create', sale);
  }

  getLastIdSale() {
    return this.http.get<number>('http://localhost:4000/sales/lastIdSale');
  }

}
