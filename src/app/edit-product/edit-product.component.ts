import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  productId! : string;
  Product! : Product;
  productFormGrop! : FormGroup;
  constructor(private root : ActivatedRoute, private service : ProductService, private formBuilder : FormBuilder, private router: Router){
    this.productId = this.root.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.service.getProduct(this.productId).subscribe({
      next : (data)=>{
        this.Product = data;
        this.productFormGrop = this.formBuilder.group({
          name : this.formBuilder.control(this.Product.name,[Validators.required]),
          price : this.formBuilder.control(this.Product.price,[Validators.required]),
          promotion : this.formBuilder.control(this.Product.promotion,[Validators.required]),
        })
      },
      error : (err)=>{
        console.log(err);
      }
    })
  }

  getErrorMessage(field: String, errors: ValidationErrors){
    if(errors['required']) return field+' is required';
    else if(errors['minlength']) return field+' should have at least ' +errors['minlength']['requiredLength']+' characters';
    else if(errors['min']) return field+' should have at least ' +errors['min']['min'];
    else return null;
  }
  handleEditeProduct(){
    this.Product = this.productFormGrop.value
    this.Product.id = this.productId
    this.service.updateProduct(this.productFormGrop.value).subscribe({
      next : (data)=>{
        this.router.navigateByUrl("/admin/products")
      },
      error : (err)=>{
        console.log(err)
      }
    })
  }

}
