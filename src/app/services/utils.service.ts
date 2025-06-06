import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { Coupon, Events } from '../models/coupon';
import { CustomNotification } from '../models/user.model'; // Asegurate de que este archivo tenga la interfaz correcta

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private notifications = new BehaviorSubject<CustomNotification[]>(
    this.loadNotifications()
  );
  notifications$ = this.notifications.asObservable();

  alertCtrl = inject(AlertController);

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  // ============ Alert ===========
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  // ============ Toast ===========
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // ============ Router ===========
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // ============ Modal ===========
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
  }

  // ============ Cámara ===========
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }

  // ============ LocalStorage ===========
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  // ============ Cupones y Eventos ===========
  getCoupons() {
    return fetch('./assets/data/data.json')
      .then(async (res) => {
        const coupons: Coupon[] = (await res.json()) as Coupon[];
        coupons.forEach((c) => (c.active = false));
        return Promise.resolve(coupons);
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject([]);
      });
  }

  getEvents() {
    return fetch('./assets/data/eventos.json')
      .then(async (res) => {
        const events: Events[] = (await res.json()) as Events[];
        return Promise.resolve(events);
      })
      .catch((err) => {
        console.error('Error al cargar eventos:', err);
        return Promise.reject([]);
      });
  }

  // ============ Notificaciones ===========
  storeNotification(notification: any) {
    let notifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    );

    const customNotification: CustomNotification = {
      ...notification,
      read: false,
    };

    notifications.unshift(customNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notifications.next(notifications);
  }

  getNotifications(): CustomNotification[] {
    return this.notifications.value;
  }

  clearNotifications() {
    this.notifications.next([]);
    localStorage.removeItem('notifications');
  }
  removeNotification(index: number) {
    const current = this.getNotifications();
    current.splice(index, 1);
    localStorage.setItem('notifications', JSON.stringify(current));
    this.notifications.next(current);
  }

  markAsRead(index: number) {
    const notifs = this.getNotifications();
    if (notifs[index]) {
      notifs[index].read = true;
      localStorage.setItem('notifications', JSON.stringify(notifs));
      this.notifications.next([...notifs]);
    }
  }

  private loadNotifications(): CustomNotification[] {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  }

  async presentAlertConfirm(opts: {
    header: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: opts.header,
        message: opts.message,
        buttons: [
          {
            text: opts.cancelText || 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: opts.confirmText || 'Aceptar',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }
}
