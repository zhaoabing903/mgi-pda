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
  selector: 'page-OutFlow',
  templateUrl: 'outflow.html',
  styleUrls: ['outflow.scss']
})

// @Component({
//   selector: 'page-OutFlow',
//   templateUrl: 'page.page.html',
//   styleUrls: ['home.page.scss'],
// })
export class OutFlowPage extends BaseUI implements OnInit {
  @ViewChild('searchbar', { static: false }) searchbar: any;
  @ViewChild('flowtubeList', { static: true }) flowtubeList: IonList;
  @ViewChild('selectworkshop', { static: true }) selectworkshop: IonSelect;

  fetching = false;
  barTextHolderText = 'Please scan the label'; // 扫描文本框placeholder属性
  workshopList = [];
  q: any = {
    plant: '', // 工厂
    workshop: '', // 车间
    label: ''
  };
  data: any[] = [];

  keyPressed: any;
  errors: any[] = [];

  keyPlant = 'kb_plant';
  keyWorkshop = 'kb_workshop';

  ci = 0;
  setp = 0;

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
        this.submit();
        break;
      case 113:
        // f2
        this.reset();
        break;
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.addkey();
      this.searchbar.setFocus();
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
  }

  private getWorkshops(val) {
    // let loading = super.showLoading(this.loadingCtrl, '加载中...');
    this.api.get('system/getPlants', { plant: this.api.plant, type: 0 })
      .subscribe(
        (res: any) => {
          if (res.successful) {
            this.workshopList = res.data;
            if (val) {
              this.q.workshop = val;
              // this.selectworkshop.selectedText = this.workshopList.find(p => p.value === this.q.workshop).text;
            } else {
              this.q.workshop = this.workshopList[0].value;
              // debugger
            }
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
    if (item)
      e.target.selectedText = item.text;
  }

  // 扫箱
  scanBox() {
    if (!this.q.label || this.q.label.length !== 4) {
      this.insertError('Invalid label. Please scan another label, the error label is ' + this.q.label, 0);
      this.setFocus();
      return;
    }

    // debugger
    const i = this.data.find(
      p =>
        p.plant_code === this.q.plant &&
        p.workshop_code === this.q.workshop &&
        p.card_code === this.q.label
    );
    if (i) {
      this.ci = i.pi
      this.setFocus();
      return;
    }
    // const i = this.data.findIndex(
    //   p =>
    //     p.plant_code === this.q.plant &&
    //     p.workshop_code === this.q.workshop &&
    //     p.card_code === this.q.label
    // );
    // if (i >= 0) {
    //   // 已扫过的零件，直接追加
    //   this.moveItem(this.data, i, 0);
    //   this.data[0].pack_count++;
    //   this.data[0].part_count += this.data[0].packing_qty;
    //   this.setFocus();
    //   return;
    // }

    // 不存在的零件，查询出零件信息，再push到list中
    // let loading = super.showLoading(this.loadingCtrl, '加载中...');
    this.api.post('dd/getScanFlow', {
      plant: this.q.plant,
      workshop: this.q.workshop,
      ScanCode: this.q.label
    })
      .subscribe(
        (res: any) => {
          if (res.successful) {
            const pts = res.data;
            if (pts.length > 0) {
              this.addData(pts);

              if (res.message) {
                // 包装数不一致的提示信息
                this.insertError(res.message, 1);
              }
              this.setFocus();
            }
          } else {
            // super.showToast(this.toastCtrl, res.message, 'error');
            this.insertError(res.message);
          }
          // loading.dismiss();
          this.setFocus();
        },
        error => {
          // loading.dismiss();
          // super.showToast(this.toastCtrl, '系统错误', 'error');
          this.insertError('System error!', 1);
          this.setFocus();
        }
      );
  }

  switchPart(i) {
    if (i > 0) {
      if (this.ci < this.data.length - 1) {
        this.ci++;
      }
    } else {
      if (this.ci > 0) {
        this.ci--;
      }
    }
  }

  addData(e: any[]): boolean {
    const res = false;

    e.forEach(p => {
      p.pi = this.data.length;
      this.data.push(p);
    });
    this.ci = this.data.length - 1;

    if (e.length > 0) {
      this.setCache();
    }
    this.setFocus();
    return res;
  }
  setCache() {
    const plant = this.storage.get(this.keyPlant);
    const workshop = this.storage.get(this.keyWorkshop);
    if (plant !== this.q.plant) {
      this.storage.set(this.keyPlant, this.q.plant);
    }
    if (workshop !== this.q.workshop) {
      this.storage.set(this.keyWorkshop, this.q.workshop);
    }
  }
  remove(ci: number) {
    // const i = this.data.findIndex(p => p.box_label === item.box_label);
    this.data.splice(ci, 1);
    this.ci = ci > 0 ? ci - 1 : 0;
    if (!this.data.length) {
      this.reset();
    } else {
      this.setFocus();
    }
  }

  // index是当前元素下标，tindex是拖动到的位置下标。
  moveItem = (arr, index, tindex) => {
    // 如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    // 我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    if (index > tindex) {
      arr.splice(tindex, 0, arr[index]);
      arr.splice(index + 1, 1);
    } else {
      // 如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
      // 这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
      arr.splice(tindex + 1, 0, arr[index]);
      arr.splice(index, 1);
    }
  }
  // 非标跳转Modal页
  changeQty(item) {
    item.pack_count = Math.ceil(item.part_count / item.packing_qty);
  }
  changeStock(item) {
    item.part_count = item.MaxStock - item.CurrentStock
  }

  // 出库
  submit() {
    if (this.setp < 1) {
      this.setp = this.setp + 1
      return
    }
    if (this.fetching) {
      this.insertError('Submitting, please waitting, do not submit again...', 1);
      return;
    }
    let err = '';
    if (!this.q.workshop) {
      err = 'Please select the target workshop first';
      this.insertError(err, 1);
    }
    if (!this.data.length) {
      err = 'Please scan parts';
      this.insertError(err, 1);
    }
    if (err.length) {
      this.setFocus();
      return;
    }
    // let loading = super.showLoading(this.loadingCtrl, '正在提交...');
    this.insertError('Submitting, please wait...', 1);
    this.fetching = true;
    this.api.post('dd/submitScanGroupFlow', this.data).subscribe(
      (res: any) => {
        this.fetching = false;
        if (res.successful) {
          this.data = [];
          this.errors = [];
          if (res.message) {
            this.insertError(res.message);
          } else {
            this.insertError('Submit successfully', 2);
          }
        } else {
          this.insertError(res.message);
        }
        // loading.dismiss();
        this.setFocus();
      },
      error => {
        this.fetching = false;
        this.insertError('system error!');
        this.setFocus();
      }
    );
  }

  reset() {
    this.errors = [];
    this.data = [];
  }
  back() {
    if (this.setp === 0)
      this.navCtrl.back();
    else
      this.setp = this.setp - 1;
  }

  setFocus() {
    this.q.label = '';
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 200);
  }
}
