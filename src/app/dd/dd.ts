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
          this.setFocus();
        },
        err => {
          this.insertError('System error!', 1);
          this.setFocus();
        }
      );
  }

  changeWorkshop(e) {
    const item = this.workshopList.find(p => p.value === this.q.workshop);
    if (item) {
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
            this.supplierList.unshift({ value: '', text: '--' });
          } else {
            this.insertError(res.message);
          }
        },
        error => {
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
  // 执行下拉刷新
  doInfinite(e) {
    // 如果是第一页，则隐藏ion-infinite-scroll，即“正在加载更多”
    if (this.q.pi === 1) {
        e.target.complete();
        e.target.disabled = false;
    } else {
      // 如果不是第一页，则继续刷新（调用getDatas（方法））
        this.getDatas(e);
    }
  }
  getDatas(e) {
    const that = this;
    this.api.post('dd/getRunsheet', that.q)
      .subscribe(
        (res: any) => {
          if (res.successful) {
            const ds = res.data;
            const pc = this.pageCount(ds.total, that.q.ps);
            if (that.q.pi === pc) {
              that.hasMore = false;
            }
            that.data = that.data.concat(ds.rows);
            // 每次刷新完，都把正在刷新隐藏起来
            if (e) {
              e.target.complete();
              if (that.q.pi === pc) {
                e.target.disabled = false;
              }
            }
            that.q.pi++;
          } else {
            super.showToast(that.toastCtrl, res.message, 'danger');
          }
        },
        error => {
          this.insertError('System error!', 1);
          this.setFocus();
        }
      );
  }
  pageCount(totalCount: number, pageSize: number) {
    return (totalCount + pageSize - 1) / pageSize;
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
