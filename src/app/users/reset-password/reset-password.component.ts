import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public recoveryPassword:string;
  public newPassword:string;
  public confirmPassword:string;


  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
  }

  public updatePasswordFunction(): any {

    if (!this.recoveryPassword) {
      this.toastr.warning("recovery password is missing", "Warning!");
    }

    else if (!this.newPassword) {
      this.toastr.warning("new Password is missing ", "Warning!");
    }

    else if (!this.confirmPassword ) {
      this.toastr.warning("confirm password is missing", "Warning!");
    }

    else if (this.confirmPassword != this.newPassword ) {
      this.toastr.warning("password doesn't match", "Warning!");
    }
   
    else {
      let data = {
        recoveryPassword:this.recoveryPassword,
        newPassword:this.newPassword
      }

      //console.log(data)  
      this.appService.updatePassword(data).subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
             this.toastr.success("Update Password", "Password updated successfully!");

             setTimeout(()=>{this.router.navigate(['/login'])},2000)

           
          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            if(error.status == 404){
              this.toastr.warning("Reset Password Failed", "Email Not Found!");
            }
            else{
              this.toastr.error("Some Error Occurred", "Error!");
             
  
            }
              
          });//end calling resetPassword
    }
  }//end forgotPasswordFunction


}
