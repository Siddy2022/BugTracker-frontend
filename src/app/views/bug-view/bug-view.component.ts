import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-bug-view',
  templateUrl: './bug-view.component.html',
  styleUrls: ['./bug-view.component.css']
})
export class BugViewComponent implements OnInit {

  public AllCommentsOfBug: any;
  public comment: any;
  public AllBugs: any;
  public description: any;
  public assignee: any;
  public status: any;
  public users: any;
  public users1:any=[];
  public users2:any=[];
 

  public bugDetails:any=[];

  public userId:any;
  public fullName:any;
  public token:any;

  public bugId:any;
  public bugTitle:any;

  constructor(
    public socketService: SocketService,
              public appService: AppService, 
              public _route: ActivatedRoute,
              public  router: Router,
             public toastr: ToastrService
  ) { }

  ngOnInit() {


    this.userId = Cookie.get("receiverId");
    this.fullName = Cookie.get("receiverName");
    this.token = Cookie.get('authToken')

    let bugId = this._route.snapshot.paramMap.get('bugId');

    this.appService.getBug(bugId).subscribe(
      (apiResponse: any) => {

        this.bugDetails = apiResponse.data
        this.bugId=this.bugDetails.bugId;
      }, (err) => {
        console.log(err);
      }

    )
    
    this.checkStatus();
    this.bugUpdatedResponse();
    this.newBugAddedResponse()

    this.getAllBugs()
    this.getAllCommentsOnBug();
    this.commentAddedResponse();

    this.responseAlreadyWatcher();
    this.save_watch()

    this.getBug()
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
    //  this.requests = apiResponse.data.requests;
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

        this.users=temp;
      }

    });//end subscribe

}//end getOnlineUserList



//Getting All Items:
public getAllBugs = () => {
  this.appService.getBugs().subscribe((apiResponse: any) => {

    this.AllBugs = apiResponse.data
  }, (err) => {
    console.log(err);
  })
}





public getBug=()=>{

  let bugId = this._route.snapshot.paramMap.get('bugId');

  this.appService.getBug(bugId).subscribe(
    (apiResponse: any) => {

      this.bugDetails = apiResponse.data
      this.bugId=this.bugDetails.bugId;
    }, (err) => {
      console.log(err);
    }

  )
}



//Getting All Items:
public getAllCommentsOnBug = () => {
  let bugId = this._route.snapshot.paramMap.get('bugId');

  //console.log(this.bugId)
  this.appService.getAllCommentOnBug(bugId).subscribe((apiResponse: any) => {

    this.AllCommentsOfBug=apiResponse.data
  }, (err) => {
    console.log(err);
  })
}




//Update a bug details for all users:
public setBugDetails = (bugId, bugTitle,status,description,assignee) => {
  this.getAllUsers()
  this.bugId = bugId
  this.bugTitle = bugTitle
  this.status=status
  this.description=description
  this.assignee=assignee
}


public updateIssue = () => {
  let data = {
    issueTitle: this.bugTitle,
    issueId: this.bugId,
    status:this.status,
    description:this.description,
    assignee:this.assignee
  }
  this.appService.editBug(data,this.token).subscribe((apiResponse: any) => {
    this.getBug();
    this.socketService.updateBug(this.fullName)
  }, (err) => {
    this.toastr.error(`Unable to update Bug details`)
  })

}

public bugUpdatedResponse = () => {
  this.socketService.bugUpdatedResponse().subscribe((response) => {
    this.toastr.success(response)
    this.getBug();
  })
}


//listening event for add bug  
public newBugAddedResponse = () => {
  this.socketService.bugAddedResponse().subscribe((response) => {
    this.toastr.success(response);
  })
}


public deleteBug():any{

  let data = {
    issueTitle: this.bugTitle,
    issueId: this.bugId,
    status:this.status,
    description:this.description,
    assignee:this.assignee
  }

  this.appService.deleteBug(data,this.bugId).subscribe(
    data=>
    {
      this.toastr.success("Bug deleted succesfully");
      setTimeout(()=>{
        this.router.navigate(['/dashboard']);
      },1000)
    },
    error=>
    {
      this.toastr.error("some error occured");
    }
  )
}//end of deleteThisBlog





//for creating OR registering new bug
public addNewComment = () => {
  if (!this.comment) {
    this.toastr.warning(`Please enter comment`);
  }
  else {
    let values = {
      issueId: this.bugId,
      userId: this.userId,
      userName: this.fullName,
      comment:this.comment

    }

    this.appService.addComment(values).subscribe((apiResponse: any) => {

      if (apiResponse.status == 200) {
        this.toastr.success(apiResponse.message);
        this.comment = ""
        this.getAllCommentsOnBug()
        this.socketService.addComment(this.fullName)
      }
    }, (error) => {
      console.log(`Error Occured`)
    })
  }
}



public commentAddedResponse = () => {
  this.socketService.commentAddedResponse().subscribe((response) => {
    this.toastr.success(response)
    this.getAllCommentsOnBug();
  })
}




//watch related functionalities

  public addAsWatcher = (bugId) => {
    let data = {
      issueId:bugId,
      watcherId: this.userId,
      watcherName: this.fullName
    }

    this.socketService.addAsWatcher(data)
    this.getBug();
    this.getAllBugs();
  }

  public responseAlreadyWatcher = () => {
    this.socketService.responseAlreadyWatcher().subscribe((response) => {
      this.toastr.error(response)
    })
  }

  public save_watch = () => {
    this.socketService.save_watch().subscribe((response) => {
      this.toastr.success(response);
      this.getAllUsers();
      this.getBug();
    })
  }



}
