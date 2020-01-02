import { LoadingController, ToastController,  AlertController} from '@ionic/angular';

// /**
//  * UI 层的所有公用方法的抽象类
//  *
//  * @export
//  * @abstract
//  * @class BaseUI
//  */
export abstract class BaseUI {
  constructor() {}

  // /**
  //  * 通用的展示 loading 的组件
  //  *
  //  * @protected
  //  * @param {LoadingController} loadingCtrl
  //  * @param {string} message
  //  * @returns {Loading}
  //  * @memberof BaseUI
  //  */
  async showLoading(loadingCtrl: LoadingController,
                        message: string)  {
    let loader =await loadingCtrl.create({
      message: message,
      keyboardClose:true,
      backdropDismiss:true//页面变化的时候自动关闭 loading
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
  async showToast(toastCtrl: ToastController, message: string, css?: string) {
    const toast =await toastCtrl.create({
      message: message,
      duration: 5000, //默认展示的时长
      position: 'bottom',
      cssClass: css? css: 'tip',
      showCloseButton: true,
      closeButtonText: 'close',
    });
    toast.present();
    //return toast;
  }

  async showMessageBox(alertCtrl:AlertController, message: string, title: string){
    let alert =await alertCtrl.create({
      header: title,
      message:message,
      buttons: ['OK']
    });
    return alert.present();;
  }

  async presentAlert(alertCtrl:AlertController,message:string) {
    const alert = await alertCtrl.create({
      header: 'Toast',
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


}
