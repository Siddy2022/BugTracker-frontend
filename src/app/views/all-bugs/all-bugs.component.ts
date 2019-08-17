import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-all-bugs',
  templateUrl: './all-bugs.component.html',
  styleUrls: ['./all-bugs.component.css']
})
export class AllBugsComponent implements OnInit {

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
  public bug:String;

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

  public searchedText="";
  private incrementer: number;
  private placeholderArray: string[];
  public placeholderText: string;

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

    
    this.incrementer = 1;
    this.placeholderArray = [
      "Search by name...",
      "Search by title...",
      "Search by bug..."
    ];
    this.placeholderText = this.placeholderArray[0];
    // after every 2.5 seconds
    setInterval(() => {
      this.placeholderText = this.placeholderArray[this.incrementer];
      ++this.incrementer;
      if (this.incrementer === 3) this.incrementer = 0;
    }, 2000);


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
      
      //sorting bug which are assigned to me
      this.assignedBug=[];
      this.reportedBug=[];
      this.otherUsersRealatedBug=[];


      if(this.AllBugs!=null){

        for(let iss of this.AllBugs){
          if(this.fullName==iss.assignee){
            this.assignedBug.push(iss);
          }
        }
  
        for(let iss of this.AllBugs){
          if(this.fullName==iss.reporterName){
            this.reportedBug.push(iss);
          }
        }
  
        for(let iss of this.AllBugs){
          if(this.fullName!=iss.reporterName && this.fullName!=iss.assignee ){
            this.otherUsersRealatedBug.push(iss);
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
      this.toastr.warning("Please select status option");
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
