import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://api.bugtracker.gq/api/v1';

  constructor(
    public http: HttpClient
  ) { }

  public getUserInfoFromLocalStorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  

  public LoginFunction  (data): Observable<any> {
    
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
      
    return this.http.post(`${this.url}/users/login`, params);
  } // end of signinFunction function.



  //Method to get country list
  public getCountryList=()=>{
    let response=this.http.get('../assets/countries.json');
    return response;
  }//end
  //method to get country code
  public getCountryCode=()=>{
    let response=this.http.get('../assets/country-code-list.json');
    return response;
  }//end

  public signupFunction  (data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('country',data.country)

    return this.http.post(`${this.url}/users/signup`, params);

  } // end of signupFunction function.


   //Method to verify email
   public verifyEmail = (data): Observable<any> => {
    return this.http.get(`${this.url}/users/${data}/verifyUser`);
  }
  //end method

  public resetPassword = (data): Observable<any> =>{

    const params = new HttpParams()
      .set('email', data.email)

    return this.http.post(this.url+'/users/recovery-password', params);


  }//end resetPassword


  public updatePassword = (data): Observable<any> =>{

    const params= new HttpParams()
    .set('recoveryPassword',data.recoveryPassword)
    .set('password',data.newPassword)

    return this.http.post(`${this.url}/users/update-password`,params);
  }

    //Get All Users:
    public getAllpeople = (): Observable<any> => {
      return this.http.get(`${this.url}/users/all?authToken=${Cookie.get('authtoken')}`)
    }




    //Method to get All bugs
    public getBugs = (): Observable<any> => {
      return this.http.get(`${this.url}/bugs/allBugs?authToken=${Cookie.get('authtoken')}`);
    }
    //end method


    //Creating a new Bug:
    public createBug = (data): Observable<any> => {
      const params = new HttpParams()
        .set("bugTitle", data.bugTitle)
        .set("reporterId", data.reporterId)
        .set("reporterName",data.reporterName)
        .set("status",data.status)
        .set("description",data.description)
        .set("attachments",data.attachments)
        .set("assignee",data.assignee)

        return this.http.post(`${this.url}/bugs/registerBug?authToken=${Cookie.get('authtoken')}`, params)
    }

    //Method to get single bug details
    public getBug = (bugId): Observable<any> => {
      return this.http.get(`${this.url}/issues/${bugId}/getBug?authToken=${Cookie.get('authtoken')}`);
    }
    //end method

    //Method to edit bug title
    public editBug = (bugDetails,bugId) : Observable<any> => {
     
      return this.http.put(`${this.url}/bugs/${bugId}/editbug?authToken=${Cookie.get('authtoken')}`,bugDetails);

    }

    public deleteBug = (bugDetails,bugId) : Observable<any> => {
     
      return this.http.put(`${this.url}/bugs/${bugId}/deleteBug?authToken=${Cookie.get('authtoken')}`,bugDetails);

    }



    //add a new comment to bug:
    public addComment = (data) : Observable<any> => {
      const params = new HttpParams()
        .set("bugId", data.bugId)
        .set("userId", data.userId)
        .set("userName",data.userName)
        .set("comment",data.comment)
        return this.http.post(`${this.url}/comments/addComment?authToken=${Cookie.get('authtoken')}`, params)
    }


    //Method to get all comments on Bug
    public getAllCommentOnBug = (bugId): Observable<any> => {
      return this.http.get(`${this.url}/comments/${bugId}/getCommentsOnIssue?authToken=${Cookie.get('authtoken')}`);
    }
    //end method





    public logout(): Observable<any> {
      const params = new HttpParams()
      .set('authtoken', Cookie.get('authtoken'));

      return this.http.post(`${this.url}/users/logout?authToken=${Cookie.get('authtoken')}`,params);
  
    } // end logout function
  
}
