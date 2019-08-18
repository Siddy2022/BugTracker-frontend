import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public baseurl = "http://localhost:3002"
  public socket;


  constructor(public http: HttpClient) {
    this.socket = io(this.baseurl)
   }

   //Authentication Section:

  public verifyUser = () =>{
    return Observable.create((observer)=>{
      this.socket.on("verify-user",(socketData)=>{
        observer.next(socketData)
      })
    })
  }

  public setUser = (token) => {
    this.socket.emit("set-user", token)
  }


  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("onlineUsers", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList




  //list create socket service for multi user
  public createBug = (userName) => {
    this.socket.emit("createBug",userName)
  }

  public bugAddedResponse = ()=>{
    return Observable.create((observer)=>{
      this.socket.on("createBug-res",(data)=>{
        observer.next(data);
        console.log(data);
      })
    })
  }


  //bug title update(edit) respose

  public updateBug =(userName)=>{
    this.socket.emit("updateBug",userName)
  }

  public bugUpdatedResponse = () => {
    return Observable.create((observer)=>{
      this.socket.on("updateBug-res",(data)=>{
        observer.next(data);
      })
    })
  }


  //comments on bug response

  public addComment =(userName)=>{
    this.socket.emit("addComment",userName)
  }

  public commentAddedResponse = () => {
    return Observable.create((observer)=>{
      this.socket.on("addComment-res",(data)=>{
        observer.next(data);
      })
    })
  }


  

  public disconnectedSocket = () => {

    this.socket.emit("disconnect","");//end Socket

  }//end disconnectedSocket
  public exitSocket = () =>{

    this.socket.disconnect();

  }// end exit socket





  /**
   * Bug watch functionality
   */

   //Add As Watcher:

  public addAsWatcher=(data)=>{
    this.socket.emit("watch",data);
  }

  public responseAlreadyWatcher=()=>{
    return Observable.create((observer)=>{
      this.socket.on("alreadyWatcher",(data)=>{
        observer.next(data);
      })
    })
  }

  public save_watch=()=>{
    return Observable.create((observer)=>{
      this.socket.on("savewatch",(data)=>{
        observer.next(data);
      })
    })
  }






}
