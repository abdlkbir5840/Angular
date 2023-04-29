import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, retry, throwError } from 'rxjs';
import { Appuser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  users : Appuser[] = [];
  authenticatedUser : Appuser | undefined;
  constructor() {
    this.users.push(
      {userId : UUID.UUID(),username : "user1", password:"user1",roles:["USER"]},
      {userId : UUID.UUID(),username : "admin", password:"admin",roles:["ADMIN"]},
      {userId : UUID.UUID(),username : "user3", password:"user3",roles:["USER","ADMIN"]},
      )
  }

  public login(username: string, password:string):Observable<Appuser>{
    let appUser = this.users.find(user=>user.username == username);
    if(!appUser) return throwError(()=>new Error("User not found"));
    if(appUser.password != password) return throwError(()=>new Error("Bad credentials"));
    return of(appUser);
  }

  public authenticateUser(appUser : Appuser):Observable<boolean>{
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser",JSON.stringify ({username : appUser.username, roles: appUser.roles, jwt : "JWT_TOKEN"}));
    return of(true);
  }

  public hasRole(role: string) : boolean{
    return this.authenticatedUser!.roles.includes(role);
  }

  public isAuthenticated(){
    return this.authenticatedUser != undefined
  }

  public logout():Observable<boolean>{
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
}
