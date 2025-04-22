import { Component, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { register } from 'swiper/element/bundle';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { UtilsService } from './services/utils.service';

register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.showSplash();
    if(this.platform.is('capacitor')) this.initPush();
  }

  utilsSvc = inject(UtilsService);

  initPush() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      localStorage.setItem('token', token.value)
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ' + JSON.stringify(notification));
      this.utilsSvc.presentAlert({
        header: notification.title,
        message: notification.body
      });
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });
  }

  

  async showSplash(){
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
