import {Component, ViewChild, Injector} from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

import {Api, User} from '../../providers';
import { HomePage, BaseUI } from '../';
import { Router } from '@angular/router';
// import {Storage} from "@ionic/storage";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BaseUI{
  @ViewChild('userName',{static:false}) usernameInput:any;
  //workshops: any[] = [];
  version: string;
  workshop: string;
  account: { name: string, password: string } = {
    name: '',
    password: ''
  };

  constructor(
    private injector: Injector,
    public navCtrl: NavController,
    //private storage: Storage,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public api: Api
              ) {
    super();
    // this.version = this.api.version;
  }

  ionViewDidLoad() {
    this.setFocus();
    /*let loading = super.showLoading(this.loadingCtrl, "正在加载数据...");
    setTimeout(() => {
      this.api.get('system/getPlants', {plant: this.api.plant}).subscribe((res: any) => {
          loading.dismiss();
          if (res.successful) {
            this.workshops = res.data;
          } else {
            super.showToast(this.toastCtrl, res.message);
          }
        },
        (err) => {
          loading.dismiss();
          alert(err.message);
        });
    });*/
  }

  doLogin() {
      if(!this.account.name|| !this.account.password){

        super.showToast(this.toastCtrl, '请输入用户名密码');
        this.setFocus();
        return;
      }

      // let loading = super.showLoading(this.loadingCtrl, "登录中...");
      
      this.user.login(this.account).subscribe((resp) => {
        // loading.dismiss();
        //this.navCtrl.push(MainPage);
        this.user._loggedIn(resp);
    

        setTimeout(() => this.injector.get(Router).navigateByUrl('/home'));

        // this.navCtrl.navigateRoot(HomePage,  {
        //   animated: true,
        //   animationDirection: 'forward'
        // });
      }, (err) => {
        // loading.dismiss();
        super.showToast(this.toastCtrl, '登录失败' + err);
      });


  }

  setFocus=()=> {
    setTimeout(() => {
      this.usernameInput.setFocus();//为输入框设置焦点
    }, 150);
  }
}
