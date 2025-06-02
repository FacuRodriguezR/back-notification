import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification.model';
import { PushNotificationSchema } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() {}

  private http = inject(HttpClient);

  sendNotification(notification: Notification) {
    return this.http.post(
      environment.baseUrl + environment.send_notification,
      notification
    );
  }

  sendNotificationToLevel(level: number, notification: Notification) {
    return this.http.post(
      `https://notif-three.vercel.app/send-notification-to-level${level}`,
      notification
    );
  }
  subscribeToTopic(token: string, topic: string) {
    return this.http.post(
      environment.baseUrl + environment.subscribe_to_topic,
      { token, topic }
    );
  }
}
