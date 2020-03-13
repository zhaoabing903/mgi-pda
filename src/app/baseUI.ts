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
  constructor() { }

  // /**
  //  * 通用的展示 loading 的组件
  //  *
  //  * @protected
  //  * @param {LoadingController} loadingCtrl
  //  * @param {string} message
  //  * @returns {Loading}
  //  * @memberof BaseUI
  //  */
  async showLoading(loadingCtrl: LoadingController, msg: string) {
    const loader = await loadingCtrl.create({
      message: msg,
      keyboardClose: true,
      backdropDismiss: true // 页面变化的时候自动关闭 loading
    });
    // return await loader.present();
    return loader;
  }

  // /**
  //  * 通用的展示 toast 的组件
  //  *
  //  * @protected
  //  * @param {ToastController} toastCtrl
  //  * @param {string} message
  //  * @returns {Toast}
  //  * @memberof BaseUI
  //  */
  async showToast(toastCtrl: ToastController, msg: string, css?: string) {
    const toast = await toastCtrl.create({
      message: msg,
      duration: 5000, // 默认展示的时长
      position: 'bottom',
      cssClass: css ? css : 'tip',
      showCloseButton: true,
      closeButtonText: 'close'
    });
    toast.present();
    // return toast;
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
