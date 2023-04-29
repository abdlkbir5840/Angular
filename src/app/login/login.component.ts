import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  userFormGroup! : FormGroup;
  errorMessage : any;

  constructor(private formBuilder: FormBuilder,
              private loginService : LoginService,
              private router : Router
              ){}
  ngOnInit(): void {
    this.userFormGroup = this.formBuilder.group({
      username: this.formBuilder.control(null),
      password: this.formBuilder.control(null),
    })
  }

  hundleLogin(){
    let username = this.userFormGroup.value.username;
    let password = this.userFormGroup.value.password;
    this.loginService.login(username, password).subscribe({
      next : (appUser)=>{
        this.loginService.authenticateUser(appUser).subscribe({
          next : (data)=>{
            this.router.navigateByUrl('/admin')
          },
        });
      },
      error : (err)=>{
        this.errorMessage = err;
      },
    });
  }
}
