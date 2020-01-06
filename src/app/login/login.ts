import { Component, ViewChild, Injector } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController
} from '@ionic/angular';

import { Api, User } from '../../providers';
import { BaseUI } from '../';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BaseUI {
  @ViewChild('userName', { static: false }) usernameInput: any;
  // workshops: any[] = [];
  version: string;
  workshop: string;
  account: { name: string; password: string } = {
    name: '',
    password: ''
  };

  constructor(
    private injector: Injector,
    public navCtrl: NavController,
    // private storage: Storage,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public api: Api
  ) {
    super();
    this.version = this.api.version;
  }

  ionViewDidLoad() {
    this.setFocus();
    /*let loading = super.showLoading(this.loadingCtrl, '正在加载数据...');
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
    if (!this.account.name || !this.account.password) {
      super.showToast(this.toastCtrl, 'Please input your password.');
      this.setFocus();
      return;
    }

    super.showLoading(this.loadingCtrl, 'Please wait...');

    this.user.login(this.account).subscribe(
      resp => {
        this.loadingCtrl.dismiss();
        this.user._loggedIn(resp);

        setTimeout(() => this.injector.get(Router).navigateByUrl('/home'));
      },
      err => {
        this.loadingCtrl.dismiss();
        super.showToast(this.toastCtrl, 'Login failed, ' + err);
      }
    );
  }

  setFocus = () => {
    setTimeout(() => {
      this.usernameInput.setFocus(); // 为输入框设置焦点
    }, 150);
  }
}
