import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Coupon, Events } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {



  constructor(private loadingController: LoadingController, private toastController: ToastController, private router: Router, private modalController: ModalController) { }


  alertCtrl = inject(AlertController)

  loading() {
    return this.loadingController.create({ spinner: 'crescent' })
  }

  // ============ Alert ===========
async presentAlert(opts?: AlertOptions) {
  const alert = await this.alertCtrl.create(opts);
  await alert.present();
}


  // toast

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // enruta a cualquier pagina

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // guarda en local

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // obtiene un elemento desde el local storage

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  getCoupons() {
    return fetch('./assets/data/data.json').then(async res=>{
     const coupons: Coupon[] = await res.json() as Coupon[];
      coupons.forEach(c => c.active = false)
     return Promise.resolve(coupons);
    }).catch(err => {
      console.log(err);
      return Promise.reject([])
    })
  }
  getEvents() {
    return fetch('./assets/data/eventos.json')
      .then(async res => {
        const events: Events[] = await res.json() as Events[];
        return Promise.resolve(events);
      })
      .catch(err => {
        console.error('Error al cargar eventos:', err);
        return Promise.reject([]);
      });
  }

  async presentModal(opts: ModalOptions){
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if(data) return data;

  }

  dismissModal(data?: any){
    return this.modalController.dismiss(data);
  }

}
