import { PushNotificationSchema } from '@capacitor/push-notifications';

export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    points: number,
    dni: string,
    level: number,
    token: string
}

// models/custom-notification.ts


export interface CustomNotification extends PushNotificationSchema {
  read?: boolean;
}
