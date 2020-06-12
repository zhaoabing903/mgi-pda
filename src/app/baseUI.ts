import {
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular';

// /**
//  * UI 层的所有公用方法的抽象类
//  *
//  * @export
//  * @abstract
//  * @class BaseUI
//  */
export abstract class BaseUI {
  loadStatus = false;
  constructor() {}

  protected async showLoading(loadingCtrl: LoadingController, message: string) {
    this.loadStatus = true;
    const loader = await loadingCtrl.create({
      message
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.loadStatus) {
          a.dismiss().then(() => {
            // console.log('abort presenting');
          });
        }
      });
    });
    // await loader.present();
    return loader;
  }
  protected async closeLoading(loadingCtrl: LoadingController) {
    // if (this.loadStatus) { await loadingCtrl.dismiss(); }
    // this.loadStatus = false;

    this.loadStatus = false;
    return await loadingCtrl.dismiss().then(() => {
      // console.log('dismissed');
    });
  }


  protected async showToast(
    toastCtrl: ToastController,
    message: string,
    color = 'dark'
  ) {
    const toast = await toastCtrl.create({
      message,
      duration: 5000, // 默认展示的时长
      position: 'top',
      color
    });
    await toast.present();
    return toast;
  }

  async showMessageBox(
    alertCtrl: AlertController,
    msg: string,
    title: string
  ) {
    const alert = await alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    return alert.present();
  }

  async presentAlert(alertCtrl: AlertController, msg: string) {
    const alert = await alertCtrl.create({
      header: 'Toast',
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
