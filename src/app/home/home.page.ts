import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Api, Menus, User} from '../../providers';
import { BaseUI } from '../baseUI';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BaseUI {
  gridList: any[] = [];
  workshop: string;
  username: string;
  version: string;
  constructor(public navCtrl: NavController,
              public items: Menus,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private storage: Storage,
              // private app: App,
              private user: User,
              public api: Api) {
    super();
    // this.currentItems = this.items.query();
    // this.gridList = this.currentItems;
    this.storage.get('USER_INFO').then(res => {
      this.username = res;
    });
    // this.username = this.user._user.username;
    this.version = this.api.version;
  }

  ionViewDidLoad() {
    // this.getWorkshop();
  }
  // getWorkshop =()=>{
  //   this.storage.get('WORKSHOP').then((res) => {
  //     if (!res) {
  //       this.setProfile();
  //     } else {
  //       // this.workshop = res;
  //     }
  //   });
  //   const loading = super.showLoading(this.loadingCtrl, '加载中...');
  //   this.api.get('system/getMenus').subscribe((res: any)=>{
  //     if(res.successful){
  //       this.gridList = res.data;
  //     }else{
  //       super.showToast(this.toastCtrl, res.message, 'error');
  //     }
  //     loading.dismiss();
  //   },(err)=>{
  //     super.showToast(this.toastCtrl, '系统错误', 'error');
  //     loading.dismiss();
  //   })
  // }
  
  // setProfile() {
  //   const addModal = this.modalCtrl.create('SetProfilePage',{}, {enableBackdropDismiss: false, showBackdrop: false} );
  //   addModal.onDidDismiss(item => {
  //     this.getWorkshop();
  //     if (item) {
  //       //this.items.add(item);
  //     }
  //   })
  //   addModal.present();
  // }

  // openItem(item: any) {
  //   if(item.link_url)
  //     this.navCtrl.push(item.link_url, { });
  // }

  // getRowListByGridList(size) {
  //   var rowList = []
  //   for (var i = 0; i < this.gridList.length; i += size) {
  //     rowList.push(this.gridList.slice(i, i + size));
  //   }
  //   return rowList
  // }

  // goSetting(){
  //   this.navCtrl.push('SettingsPage', { });
  // }

  // logout(){
  //   this.user.logout().subscribe((re) => {
  //     setTimeout(() => {
  //       this.app.getRootNav().setRoot('LoginPage', {}, {
  //         animate: true,
  //         direction: 'forward'
  //       });
  //     });
  //   }, (r) => {
  //     alert('注销失败');
  //   });
  // }
}
