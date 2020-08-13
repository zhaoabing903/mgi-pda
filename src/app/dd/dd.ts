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
  statusList = [
  {value: '1', text: 'Waiting Send.' },
  {value: '10', text: 'Processed' },
  {value: '200', text: 'Normal Receipt' },
  {value: '210', text: 'Difference Receipt' }];
  q: any = {
    plant: '', // 工厂
    workshop: '', // 车间
    supplier: '',
    status: null,
    pi: 1,
    ps: 10
  };
  totalPages = 0;
  totalItems = 0;
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
      this.userName = val;
    });
  }

  private getWorkshops(val) {
    this.api.get('system/getPlants', { plant: this.api.plant, type: 0 })
      .subscribe(
        (res: any) => {
          if (res.successful) {
            this.workshopList = res.data;
            this.workshopList.unshift({ value: '', text: '--' });
            if (val) {
              this.q.workshop = val;
            } else {
              this.q.workshop = this.workshopList[0].value;
            }
            this.changeWorkshop(this.q.workshop);
          } else {
            this.insertError(res.message);
          }
        },
        err => {
          this.insertError('System error!', 1);
        }
      );
  }

  changeWorkshop(e) {
    const item = this.workshopList.find(p => p.value === this.q.workshop);
    if (item) {
      this.q.supplier = '';
      this.data = [];
      this.getSuppliers();
      this.getDatas(true);
    }
  }
  changeSupplier(e) {
    this.getDatas(true);
  }
  getSuppliers() {
    this.api.get('system/getSuppliers', this.q)
      .subscribe(
        (res: any) => {
          if (res.successful) {
            const pts = res.data;
            if (pts.length > 0) {
              this.supplierList = pts;
            }
            this.supplierList.unshift({ value: '', text: '--' });
          } else {
            this.insertError(res.message);
          }
        },
        error => {
          this.insertError('System error!', 1);
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

  getDatas(reload = false) {
    if (reload) {
      this.q.pi = 1;
    }
    const that = this;
    that.fetching = true;
    that.totalItems = 0;
    that.totalPages = 0;
    that.api.get('dd/getRunsheet', that.q).subscribe((res: any) => {
      that.fetching = false;
      if (res.successful) {
        const ds = res.data;
        const pc = that.pageCount(ds.total, that.q.ps);
        that.totalPages = pc;
        that.totalItems = ds.total;
        if (that.q.pi === pc) {
          that.hasMore = false;
        }
        that.data = ds.rows;
      } else {
        super.showToast(that.toastCtrl, res.message, 'danger');
      }
    },
    error => {
      that.fetching = false;
      this.insertError('System error!', 1);
    });
  }
  switchPage(t: number) {
    this.q.pi = this.q.pi + t;
    this.getDatas(false);
  }
  pageCount(totalCount: number, pageSize: number) {
    // console.log( "总条数" + totalCount + "每页总条数" + pageSize)
    if (totalCount == null || totalCount === 0) {
      return 0;
    } else {
      if (pageSize !== 0 && totalCount % pageSize === 0) {
        return parseInt((totalCount / pageSize).toString(), 10);
      }
      if (pageSize !== 0 && totalCount % pageSize !== 0) {
        return parseInt((totalCount / pageSize).toString(), 10) + 1;
      }
    }
  }
  back() {
    this.navCtrl.back();
  }
}
