import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  path: import("@angular/router").ActivatedRouteSnapshot[];
  route: import("@angular/router").ActivatedRouteSnapshot;

  constructor(
    private router: Router, 
    public toastr: ToastrService) 
    { }

    canActivate(route: ActivatedRouteSnapshot): boolean {

      console.log("in guard service");
  
      if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
        this.toastr.error("Token Expired, Please login again");
        this.router.navigate(['/']);
  
        return false;
  
      } else {
  
        return true;
  
      }
  
    }
}
