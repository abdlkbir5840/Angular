import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../model/product.model';
import { LoginService } from '../services/login.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  products! : Array<Product>;
  currentPage : number=0;
  pageSize : number=5;
  totalePage! : number;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  mode : string="all";
  constructor(private productService: ProductService,
              private router : Router,
              private formBuilder: FormBuilder,
              public authenticationService : LoginService){}
  ngOnInit(): void{
    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control(null)
    })
    this.handleGetPageProducts();
  }
  handleGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next : (data)=>{
        this.products = data;
      },
      error : (err)=>{
        this.errorMessage = err;
      }
    });
  }
  handleDeleteProduct(product: Product){
    let conf = confirm("Are you sure?");
    if (!conf) return;
      this.productService.deleteProduct(product.id).subscribe({
      next : (data)=>{
        let index = this.products.indexOf(product);
        this.products.splice(index,1);
      }
    });
  }

  handleSetPromotion(product: Product){
    let promo = product.promotion;
    this.productService.setPromotion(product.id).subscribe({
      next : (data)=>{
        product.promotion = !promo;
      },
      error : (err)=>{
        this.errorMessage = err;
      },
    });
  }
  handleSearchProducts(){
    if(this.mode == "all"){
      console.log("ok")
      this.currentPage=0;
      console.log(this.mode)
    }
    this.mode = "search";
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword, this.currentPage, this.pageSize).subscribe({
      next : (data)=>{
        this.products = data.products,
        this.totalePage = data.totalPages;
      }
    })
  }

  handleGetPageProducts(){
    this.mode = "all"
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next : (data)=>{
        this.products = data.products;
        this.totalePage = data.totalPages;
      },
      error : (err)=>{
        this.errorMessage = err;
      }
    });
  }
  goToPage(i: number){
    if(this.mode=="all"){
      this.currentPage = i;
      this.handleGetPageProducts();
    }else if(this.mode=="search"){
      this.currentPage = i;
      this.handleSearchProducts();
    }

  }
  handleNewProduct(){
    this.router.navigateByUrl("/admin/newProduct");
  }
  public handleEditeProduct(product: Product){
    this.router.navigateByUrl("/admin/editeProduct/"+product.id);
  }
}
