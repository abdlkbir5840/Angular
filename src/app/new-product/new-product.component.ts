import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
  productFormGrop! : FormGroup;

  constructor(private formBuilder : FormBuilder, private service : ProductService, private router : Router){}
  ngOnInit(): void {
    this.productFormGrop = this.formBuilder.group({
      name: this.formBuilder.control(null,[Validators.required, Validators.minLength(4)]),
      price: this.formBuilder.control(null,[Validators.required, Validators.min(150)]),
      promotion: this.formBuilder.control(false),
    });
  }

  handleAddProduct(){
    console.log(this.productFormGrop.value);
    let product = this.productFormGrop.value;
    this.service.addNewProduct(product).subscribe({
      next : (data)=>{
        confirm("Product added successfully");
        this.productFormGrop.reset();
        this.router.navigateByUrl("/admin/products");
      },
      error : (err)=>{
        console.log(err);
      }
    });
  }
  getErrorMessage(field: String, errors: ValidationErrors){
    if(errors['required']) return field+' is required';
    else if(errors['minlength']) return field+' should have at least ' +errors['minlength']['requiredLength']+' characters';
    else if(errors['min']) return field+' should have at least ' +errors['min']['min'];
    else return null;
  }
}
