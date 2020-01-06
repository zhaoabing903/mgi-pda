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
      if (val) {
        this.q.workshop = val;
      }
      this.getWorkshops();
    });
  }

  private getWorkshops() {
    // let loading = super.showLoading(this.loadingCtrl, '加载中...');
    this.api.get('system/getPlants', { plant: this.api.plant, type: 0 })
      .subscribe(
        (res: any) => {
          if (res.successful) {
            this.workshopList = res.data;
            if (
              this.q.workshop === undefined ||
              this.workshopList.findIndex(p => p.value === this.q.workshop) ===
                -1
            ) {
              this.q.workshop = this.workshopList[0].value;
            } else {
              this.selectworkshop.selectedText = this.workshopList.find(
                p => p.value === this.q.workshop
              ).text;
            }
          } else {
            // super.showToast(this.toastCtrl, res.message, 'error');
            this.insertError(res.message);
          }
          this.setFocus();
          // loading.dismiss();
        },
        err => {
          this.insertError('system error!', 1);
          this.setFocus();
          // loading.dismiss();
        }
      );
  }

  // 扫箱
  scanBox() {
    if (!this.q.label || this.q.label.length !== 4) {
      this.insertError('Invalid label, please rescan', 1);
      this.setFocus();
      return;
    }

    const i = this.data.findIndex(
      p =>
        p.plant_code === this.q.plant &&
        p.workshop_code === this.q.workshop &&
        p.card_code === this.q.label
    );
    if (i >= 0) {
      // 已扫过的零件，直接追加
      this.moveItem(this.data, i, 0);
      this.data[0].pack_count++;
      this.data[0].part_count += this.data[0].packing_qty;
      this.setFocus();
      return;
    }

    // 不存在的零件，查询出零件信息，再push到list中
    // let loading = super.showLoading(this.loadingCtrl, '加载中...');
    this.api
      .post('dd/getScanFlow', {
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

  addData(e: any[]): boolean {
    const res = false;
    e.forEach(p => {
      this.data.push(p);
    });
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
  removeData(item: any) {
    this.data = this.data.filter(
      p1 =>
        !(
          p1.plant_code === item.plant_code &&
          p1.workshop_code === item.workshop_code &&
          p1.card_code === item.card_code
        )
    );
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
  changeQty(part) {
    //   let _m = this.modalCtrl.create({component:UnstandPage, {
    //     boxes: part.require_boxes,
    //     parts: part.require_parts,
    //     std_qty: part.std_qty,
    //     max_parts: part.current_parts,
    //   }
    // });
    // _m.onDidDismiss(data => {
    //   if (data) {
    //     part.require_boxes = data.boxes;
    //     part.require_parts = data.parts;
    //   }
    //   this.setFocus();
    // });
    // _m.present();
  }

  // 出库
  submit() {
    if (this.fetching) {
      this.insertError('正在提交，请耐心等待，不要重复提交...', 1);
      return;
    }
    let err = '';
    if (!this.q.workshop) {
      err = '请先选择目标车间';
      this.insertError(err, 1);
    }
    if (!this.data.length) {
      err = '请添加出库的零件';
      this.insertError(err, 1);
    }
    if (err.length) {
      this.setFocus();
      return;
    }
    // let loading = super.showLoading(this.loadingCtrl, '正在提交...');
    this.insertError('正在提交，请稍后...', 1);
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
    this.navCtrl.back();
  }

  setFocus() {
    this.q.label = '';
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 200);
  }
}
