import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonApp } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import { Api, User, Menus } from '../providers';
// import { InterceptorService } from 'src/providers';
import { GlobalHttpIntercept } from 'src/providers/interceptor/global.http.intercept';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()],


  providers: [
    Api,
    Menus,
    User,
    IonApp,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // InterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpIntercept, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
