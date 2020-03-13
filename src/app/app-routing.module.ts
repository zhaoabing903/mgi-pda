import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginPage } from './login/login';

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomePageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'outflow', loadChildren: './outflow/outflow.module#OutFlowPageModule' },
  { path: 'dd', loadChildren: './dd/dd.module#DDPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
