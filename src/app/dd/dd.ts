import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
  ToastController,
  IonList,
  IonSelect
} from '@ionic/angular';
import { BaseUI } from '../baseUI';
import { Api } from '../../providers';
import { Storage } from '@ionic/storage';
// import {fromEvent} from 'rxjs/observable/fromEvent';

@Component({
  selector: 'page-DD',
  templateUrl: 'dd.html',
  styleUrls: ['dd.scss']
})

export class DDPage extends BaseUI implements OnInit {

  fetching = false;
  barTextHolderText = 'Please scan the label'; // 扫描文本框placeholder属性
  workshopList = [];
  supplierList = [];
  q: any = {
    plant: '', // 工厂
    workshop: '', // 车间
    supplier: '',
    pi: 1,
    ps: 20
  };
  data: any[] = [];

  keyPressed: any;
  errors: any[] = [];
  userName: '';

  keyPlant = 'kb_plant';
  keyWorkshop = 'kb_workshop';
  userInfo = 'USER_INFO';
  hasMore = true;

  constructor(
    private navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private zone: NgZone,
    public api: Api,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {
    super();
  }

  keyDown(event) {
    switch (event.keyCode) {
      case 112:
        // f1
        // this.submit();
        break;
      case 113:
        // f2
        // this.reset();
        break;
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.addkey();
      // this.searchbar.setFocus();
    });
  }

  ionViewWillUnload() {
    this.removekey();
  }

  addkey = () => {
    // this.keyPressed = fromEvent(document, 'keydown').subscribe(event => {
    //   this.keyDown(event);
    // });
  }

  removekey = () => {
    this.keyPressed.unsubscribe();
  }

  insertError = (msg: string, t: number = 0) => {
    this.zone.run(() => {
      this.errors.splice(0, 0, { message: msg, type: t, time: new Date() });
    });
  }

  ngOnInit() {
    this.q.plant = this.api.plant;

    this.storage.get(this.keyWorkshop).then(val => {
      this.getWorkshops(val);
    });
    this.storage.get(this.userInfo).then(val => {
      this.userName = val
    });
  }

  private getWorkshops(val) {
    // let loading = super.showLoading(this.loadingCtrl, '加载中...');
    this.api.get('system/getPlants', { plant: this.api.plant, type: 0 })
      .subscribe(
        (res: any) => {
          if (res.successful) {
            this.workshopList = res.data;
            this.workshopList.unshift({ value: '', text: "--" });
            if (val) {
              this.q.workshop = val;
              // this.selectworkshop.selectedText = this.workshopList.find(p => p.value === this.q.workshop).text;
            } else {
              this.q.workshop = this.workshopList[0].value;
              // debugger
            }
            this.changeWorkshop(this.q.workshop);
          } else {
            // super.showToast(this.toastCtrl, res.message, 'error');
            this.insertError(res.message);
          }
          this.setFocus();
          // loading.dismiss();
        },
        err => {
          this.insertError('System error!', 1);
          this.setFocus();
          // loading.dismiss();
        }
      );
  }

  changeWorkshop(e) {
    const item = this.workshopList.find(p => p.value === this.q.workshop)
    if (item) {
      // if (e.target.selectedText)
      //   e.target.selectedText = item.text;
      this.q.supplier = '';
      this.data = [];
      this.getSuppliers();
      this.getDatas(null);
    }
  }
  changeSupplier(e) {
    this.getDatas(null);
  }
  getSuppliers() {
    this.api.get('system/GetSuppliers', this.q)
      .subscribe(
        (res: any) => {
          if (res.successful) {
            const pts = res.data;
            if (pts.length > 0) {
              this.supplierList = pts;
            }
            this.supplierList.unshift({ value: '', text: "--" });
          } else {
            // super.showToast(this.toastCtrl, res.message, 'error');
            this.insertError(res.message);
          }
        },
        error => {
          // loading.dismiss();
          // super.showToast(this.toastCtrl, '系统错误', 'error');
          this.insertError('System error!', 1);
          this.setFocus();
        }
      );
  }
  setMore(e, total) {
    if (total < this.q.ps) {
      if (e) {
        e.target.disabled = true;
      }
      this.hasMore = false;
    }

  }
  getDatas(e) {
    this.api.post('dd/GetRunsheet', this.q)
      .subscribe(
        (res: any) => {
          if (res.successful) {
            if (!e) {
              this.data = res.data;
              this.q.pi = 1;
              this.setMore(e, res.data.length);
            } else {
              this.data = this.data.concat(res.data);
              ++this.q.pi;
              this.setMore(e, res.data.length);
              if (e) {
                e.target.complete();
              }
            }
          } else {
            super.showToast(this.toastCtrl, res.message, 'danger');
          }
        },
        error => {
          this.insertError('System error!', 1);
          this.setFocus();
        }
      );
  }

  back() {
    this.navCtrl.back();
  }

  setFocus() {
    // setTimeout(() => {
    //   this.searchbar.setFocus();
    // }, 200);
  }
}
