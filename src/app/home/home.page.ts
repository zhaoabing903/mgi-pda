import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  IonApp,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Api, Menus, User } from '../../providers';
import { BaseUI } from '../baseUI';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage extends BaseUI implements OnInit {
  gridList: any[] = [];
  workshop: string;
  username: string;
  version = environment.version;
  constructor(
    public router: Router,
    public items: Menus,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private user: User,
    public api: Api,
    public http: HttpClient,
    public cdr: ChangeDetectorRef
  ) {
    super();

    // this.currentItems = this.items.query();
    // this.gridList = this.currentItems;
    // this.storage.get('USER_INFO').then(res => {
    //   this.username = res;
    // });
    // this.username = this.user._user.username;
  }

  ngOnInit() {
    this.getWorkshop();
  }
  getWorkshop = () => {
    this.storage.get('WORKSHOP').then(res => {
      if (!res) {
        this.setProfile();
      } else {
        // this.workshop = res;
      }
    });
    super.showLoading(this.loadingCtrl, 'Please wait...');

    this.api.get('system/getMenus').subscribe(
      (res: any) => {
        super.closeLoading(this.loadingCtrl);
        if (res.successful) {
          this.gridList = res.data;
        } else {
          super.showToast(this.toastCtrl, res.message, 'danger');
        }
      },
      err => {
        super.closeLoading(this.loadingCtrl);
        super.showToast(this.toastCtrl, 'System Error, Please check your network.', 'danger');
      }
    );
  }

  setProfile() {
    // const addModal = this.modalCtrl.create(
    //   {
    //     component:SetProfilePage,
    //     {},
    //     {enableBackdropDismiss: false, showBackdrop: false}
    //   });
    // addModal.onDidDismiss(item => {
    //   this.getWorkshop();
    //   if (item) {
    //     // this.items.add(item);
    //   }
    // })
    // addModal.present();
  }

  openItem(item: any) {
    if (item.link_url) {
      this.router.navigateByUrl('/' + item.link_url);
      // this.navCtrl.push(item.link_url, { });
    }
  }

  getRowListByGridList(size) {
    const rowList = [];
    for (let i = 0; i < this.gridList.length; i += size) {
      rowList.push(this.gridList.slice(i, i + size));
    }
    return rowList;
  }

  goSetting() {
    // this.navCtrl.push('SettingsPage', { });
  }

  logout() {
    this.user.logout();
  }
}
