import { LoadingController, ToastController,  AlertController} from '@ionic/angular';

// /**
//  * UI 层的所有公用方法的抽象类
//  *
//  * @export
//  * @abstract
//  * @class BaseUI
//  */
export abstract class BaseUI {
  constructor() {
  }

  // /**
  //  * 通用的展示 loading 的组件
  //  *
  //  * @protected
  //  * @param {LoadingController} loadingCtrl
  //  * @param {string} message
  //  * @returns {Loading}
  //  * @memberof BaseUI
  //  */
  protected showLoading(loadingCtrl: LoadingController,
                        message: string): any {
    let loader = loadingCtrl.create({
      message: message,
      keyboardClose:true,
      backdropDismiss:true//页面变化的时候自动关闭 loading
    });
    // loader.present();
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
  protected showToast(toastCtrl: ToastController, message: string, css?: string): any {
    let toast = toastCtrl.create({
      message: message,
      duration: 5000, //默认展示的时长
      position: 'bottom',
      cssClass: css? css: 'tip',
      showCloseButton: true,
      closeButtonText: '关闭',
    });
    // toast.present();
    return toast;
  }

  public showMessageBox(alertCtrl:AlertController, message: string, title: string): any{
    let alert = alertCtrl.create({
      header: title,
      message:message,
      buttons:[{
        text:'确认'
      }]
    });
    // alert.present();
    return alert;
  }
}
