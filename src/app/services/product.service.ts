import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>;
  constructor() {
    this.products=[
      {id:UUID.UUID(), name:"Computer", price:6500, promotion:true},
      {id:UUID.UUID(), name:"Printer", price:7864, promotion:false},
      {id:UUID.UUID(), name:"Smart phone", price:1246, promotion:false},
    ];
    for (let index = 0; index <10; index++) {
      this.products.push(
        {id:UUID.UUID(), name:"Computer", price:6500, promotion:true},
        {id:UUID.UUID(), name:"Printer", price:7864, promotion:false},
        {id:UUID.UUID(), name:"Smart phone", price:1246, promotion:true},
      );
    }
  }
  public getAllProducts():Observable<Array<Product>>{
    let rd = Math.random();
    if(rd<0.1)return throwError(()=>new Error("Internet connexion error"));
    else return of(this.products);
  }

  public getPageProducts(page: number, size: number):Observable<PageProduct>{
    let index = page*size;
    let totalPages = ~~(this.products.length/size);
    if(this.products.length % size !=0) totalPages++;
    let pageProduct = this.products.slice(index,size+index);
    return of({products : pageProduct, page : page, size: size, totalPages : totalPages});
  }

  public deleteProduct(id : string): Observable<boolean>{
    this.products = this.products.filter(p=>p.id!=id);
    return of(true);
  }

  public setPromotion(id : string):Observable<boolean>{
    let product = this.products.find(p=>p.id == id)
    if(product){
      product.promotion = !product?.promotion;
      return of(true);
    }else return throwError(()=>new Error("Product not found"));

  }

  public searchProducts(keyword: string, page : number, size : number): Observable<PageProduct>{
    let results = this.products.filter(p=>p.name.includes(keyword));

    let index = page*size;
    let totalPages = ~~(results.length/size);
    if(results.length % size !=0) totalPages++;
    let pageProduct = results.slice(index,size+index);
    return of({products : pageProduct, page : page, size: size, totalPages : totalPages});
  }

  public addNewProduct(product: Product):Observable<Product>{
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  public getProduct(id : String):Observable<Product>{
    let product = this.products.find(p=>p.id == id);
    if(product==undefined) return throwError(()=>new Error("product note found"));
    else return of(product);
  }

  public updateProduct(product: Product):Observable<Product>{
    this.products = this.products.map(p=>(p.id==product.id)?product:p);
    return of(product);
  }
}
