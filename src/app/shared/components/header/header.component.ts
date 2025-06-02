import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})


export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  notificationsCount = 0;
  
  
  utilsSvc = inject(UtilsService);
  
  constructor(private router: Router,
    ) { 


    }
    ionViewWillEnter() {
      this.updateUnreadCount();
    }
    
    ngOnInit() {
      // Traer notificaciones guardadas en localStorage o donde las tengas
      this.notificationsCount = this.utilsSvc.getNotifications()?.length || 0;
  
      // Opcional: suscribirse a cambios en tiempo real
      this.utilsSvc.notifications$.subscribe(list => {
        this.notificationsCount = list.length;
      });
    }

    

    get isInLogin(): boolean {
      return this.router.url.includes('/auth'); // o === '/login'
    }

    openNotifications() {
      this.router.navigate(['/notificaciones']);
    }

    updateUnreadCount() {
      const notifications = this.utilsSvc.getNotifications(); // o getNotifications$().subscribe(...) si es reactivo
      this.notificationsCount = notifications.filter(n => !n.read).length;
    }
    
  dismissModal(){
    this.utilsSvc.dismissModal();
  }

}
