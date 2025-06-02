import { PushNotificationSchema } from "@capacitor/push-notifications";

export interface Notification{
    title: string;
    body: string;
    token?: string; 
    topic?:string;
    image?: string;

}
export interface CustomNotification extends PushNotificationSchema {
    read: boolean;
  }
  