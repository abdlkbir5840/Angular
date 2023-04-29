import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent {

  constructor(public loginService : LoginService, private router : Router) {

  }

  handelLogout(){
    this.loginService.logout().subscribe({
      next : (data)=>{
        this.router.navigateByUrl("/login")
      }
    });
  }

}
