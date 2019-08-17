import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-create-bugs',
  templateUrl: './create-bugs.component.html',
  styleUrls: ['./create-bugs.component.css']
})
export class CreateBugsComponent implements OnInit {

  otherUsersRealatedBug: any=[];
  reportedBug: any=[];
  assignedBug: any=[];
  public data: any;
  public image1: any;
  public image: any;
  public bugDetails: any;
  public users: any;
  public users1: any;
  public users2:any=[];


  p: number = 1;

  q: number = 1;


  public userId: any;
  public fullName: any;
  public token: any;

  public bugTitle: any;
  public status: any;
  public description: any;
  public attachments: any;
  public assignee: any;

  public newBugStatus: any

  public newBugId: any;

  public AllBugs: any;

  //for sorting
  public sortOrder: boolean = false;
  public field: String;


  //for filter
  public filterName: any = { bugTitle: '' };



  //for selecting files
  public selectedFiles: any = []

  constructor(
    public socketService: SocketService, 
    public appService: AppService, 
    public toastr: ToastrService, 
    public router: Router
  ) { }

  ngOnInit() {

    this.userId = Cookie.get("receiverId");
    this.fullName = Cookie.get("receiverName");
    this.token = Cookie.get('authtoken')
    console.log(this.token);

    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getAllUsers();

    this.getAllBugs()



    this.newBugAddedResponse()
    this.bugUpdatedResponse()
    this.commentAddedResponse()

  }

  //To check whether the user is loggedIn or not
  public checkStatus: any = () => {
    if (Cookie.get('authtoken') === undefined || 
        Cookie.get('authtoken') === '' || 
        Cookie.get('authtoken') === null) {
          this.router.navigate(['/']);
           return false;
    } else {
      return true;
    }
  } // end checkStatus


  ngOnDestroy() {
    this.socketService.exitSocket()
  }

  //for getting all users
  public getAllUsers = () => {
    this.appService.getAllpeople().subscribe((apiResponse: any) => {
      this.users1 = apiResponse.data;    
      this.users2=[];
      for(let user of this.users1){
        if(`${user.firstName} ${user.lastName}`!=this.fullName){
          this.users2.push(user)
        }
      }
    })
  }
  




  //user confirmation

  public verifyUserConfirmation = () => {
    this.socketService.verifyUser().subscribe((response) => {
      this.socketService.setUser(this.token);
      console.log("User is verified")
    })
  }



  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList()
      .subscribe((userListfromdb) => {

        this.users = '';

        for (let x in userListfromdb) {

          let temp = { 'userId': x, 'fullName': userListfromdb[x] };

          this.users = temp;
        }

      });//end subscribe

  }//end getOnlineUserList



 


  //Getting All Items:
  public getAllBugs = () => {
    this.appService.getBugs().subscribe((apiResponse: any) => {

      this.AllBugs = apiResponse.data
      
      //sorting issue which are assigned to me
      this.assignedBug=[];
      this.reportedBug=[];
      this.otherUsersRealatedBug=[];


      if(this.AllBugs!=null){

        for(let bug of this.AllBugs){
          if(this.fullName==bug.assignee){
            this.assignedBug.push(bug);
          }
        }
  
        for(let bug of this.AllBugs){
          if(this.fullName==bug.reporterName){
            this.reportedBug.push(bug);
          }
        }
  
        for(let bug of this.AllBugs){
          if(this.fullName!=bug.reporterName && this.fullName!=bug.assignee ){
            this.otherUsersRealatedBug.push(bug);
          }
        }

      }


    }, (err) => {
      console.log(err);
    })
  }


  //for creating OR registering new bug
  public newBug = () => {
    this.getAllUsers()
    if (!this.bugTitle) {
      this.toastr.warning("Bug title is required");
    } else if (!this.status) {
      this.toastr.warning("Please select  the status ");
    }
    else if (!this.description) {
      this.toastr.warning("description is required");
    }
    else if (!this.assignee) {
      this.toastr.warning("Please select the assignee");
    }
    else {
      let values = {
        bugTitle: this.bugTitle,
        reporterId: this.userId,
        reporterName: this.fullName,
        status: this.status,
        description: this.description,
        attachments: this.data,
        assignee: this.assignee

      }

      this.appService.createBug(values).subscribe((apiResponse: any) => {

        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.bugDetails = apiResponse.data;
          this.newBugId = apiResponse.data.issueId;
          this.newBugStatus = apiResponse.status;

          this.bugTitle = ""
          this.status = ""
          this.description = ""

          this.getAllBugs();

          this.socketService.createBug(this.fullName);

          setTimeout(() => {
            this.router.navigate([`/bugDetails/${this.newBugId}`]);
          }, 1000);

          this.getAllBugs();

        }
      }, (error) => {
        console.log("Error Occured")
      })
    }
  }


  public newBugAddedResponse = () => {
    this.socketService.bugAddedResponse().subscribe((response) => {
      this.getAllBugs();
      this.toastr.success(response);
    })
  }



  //listening event for edit title

  public bugUpdatedResponse = () => {
    this.socketService.bugUpdatedResponse().subscribe((response) => {
      this.getAllBugs();
      this.toastr.success(response)
    })
  }



  //listening event for comment on issue
  public commentAddedResponse = () => {
    this.socketService.commentAddedResponse().subscribe((response) => {
      this.getAllBugs();
      this.toastr.success(response)
    })
  }



  //for sorting
  public changeOrder(field) {
    this.sortOrder = !this.sortOrder;
    this.field = field
  }




  //Logout:
  public logout = () => {

    this.appService.logout().subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        Cookie.delete('authtoken');
        
        Cookie.delete('receiverId');

        Cookie.delete('receiverName')



        this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.

        this.socketService.exitSocket()

        this.router.navigate(['/']);

      } else {
        this.toastr.error(apiResponse.message)
      } // end condition

    }, (err) => {
      this.toastr.error('Internal Server Error occured')

    });

  }

}
