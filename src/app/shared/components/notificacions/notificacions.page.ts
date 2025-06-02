import { Component, OnInit } from '@angular/core';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-notificacions',
  templateUrl: './notificacions.page.html',
  styleUrls: ['./notificacions.page.scss'],
})
export class NotificacionsPage {
  notifications = [];

  constructor(private utilsSvc: UtilsService) {}

  ionViewWillEnter() {
    this.notifications = this.utilsSvc.getNotifications();
    console.log('Mostrando notificaciones:', this.notifications);
  }

  markAsRead(notif: any) {
    if (!notif.read) {
      notif.read = true;
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
  }
  
  clearAll() {
    this.utilsSvc.clearNotifications();
    this.notifications = [];
  }

  remove(notif: any) {
    const index = this.notifications.indexOf(notif);
    if (index > -1) {
      this.utilsSvc.removeNotification(index);
      this.notifications.splice(index, 1); // actualiza la vista actual
    }
  }
}
