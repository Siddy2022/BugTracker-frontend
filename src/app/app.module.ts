import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AllBugsComponent } from './views/all-bugs/all-bugs.component';
import { CreateBugsComponent } from './views/create-bugs/create-bugs.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditBugsComponent } from './views/edit-bugs/edit-bugs.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { RouteGuardService } from './services/route-guard.service';
import { SortCountriesPipe } from './pipes/sort-countries.pipe';
import { SocketService } from './services/socket.service';
import { AppService } from './services/app.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//HttpClientModule is to be imported in latest version of angular
import { HttpClientModule } from '@angular/common/http';


//for loading spinner
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {NgxEditorModule} from 'ngx-editor';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './users/login/login.component';
import { SignupComponent } from './users/signup/signup.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { BugViewComponent } from './views/bug-view/bug-view.component';


//import this module for using animations
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SortByPipe } from './pipes/sort-by.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule} from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import {HttpModule} from '@angular/http';






@NgModule({
  declarations: [
    AppComponent,
    AllBugsComponent,
    CreateBugsComponent,
    DashboardComponent,
    EditBugsComponent,
    BugViewComponent,
    NotfoundComponent,
    LoginComponent,
    DashboardComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FilterPipe,
    SortByPipe,
    SortCountriesPipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    TooltipModule,
    NgxEditorModule,
    FilterPipeModule,
    HttpModule,
    Ng4LoadingSpinnerModule,
  
    ToastrModule.forRoot(),

    //routerModule forRoot method is use to declare the possible routes in the application
      RouterModule.forRoot([
       
      {path:'login',component:LoginComponent},
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'dashboard',component:DashboardComponent,canActivate:[RouteGuardService]},
      {path:'goback/:userId',component:DashboardComponent,canActivate:[RouteGuardService]},
      {path:'createBug',component: CreateBugsComponent,canActivate:[RouteGuardService]},
      {path:'editbug/:bugId',component: EditBugsComponent,canActivate:[RouteGuardService]},
      {path:'register',component:SignupComponent},
      {path:'bugDetails/:bugId',component:BugViewComponent, canActivate:[RouteGuardService]},
      {path:'forgot-password',component:ForgotPasswordComponent},
      {path:'all-bugs',component:AllBugsComponent, canActivate:[RouteGuardService]},
      {path:'reset-password',component:ResetPasswordComponent},
      {path:'**',component: NotfoundComponent}

    ])




  

    
  ],

 
  providers: [AppService,SocketService,SortCountriesPipe,RouteGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
