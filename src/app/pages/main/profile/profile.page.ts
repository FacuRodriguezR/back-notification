import { Component, Inject, inject, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  users: User[] = [];
  loading: boolean = false;

  constructor() { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  notificationSvc = inject(NotificationsService)

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser();
  }
  

  getUser(){
    let path = `users`
    let query = [

    ];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.users = res;

        this.loading = false;

        sub.unsubscribe()
      }
    })
  }


  // abrir formulario para enviar notificaciòn
  async openNotificationForm(user?: User) {
    this.utilsSvc.presentAlert({
      header: 'Nueva notificación!',
      message: `Envía notificación a ${user ? user.name : 'Todos los usuarios'}`,
      inputs: [
        {
          name: 'title', 
          placeholder: 'Título (máximo 30 caracteres)',
          attributes: {
            maxlength: 30
          }
        },
        {
          name: 'body',
          type: 'textarea',
          placeholder: 'Contenido'
        }
      ],

      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Enviar',
          handler: (res) => {
            console.log(res);

            const {title, body} = res;

            if(title && body){

              let message: Notification = {
                title,
                body
              }

            if(user) message.token = user.token;
            else message.topic = 'general'

            this.sendNotification(message)

              return true;
            } else {
              this.utilsSvc.presentToast({
                message: 'Ingresa todos los campos para enviar la notificación',
                duration: 2500,
                color: 'danger',
                position: 'bottom',
                icon: 'alert-circle-outline'
              })

              return false;
            }
          }
        }
      ]
    });
  

  }

  //enviar notificacion a token
  sendNotification(notification:Notification){
    this.notificationSvc.sendNotification(notification).subscribe({
      next: (res: string) => {
        console.log(res);
      }
    })
  }


  subscribeToGeneralTopic(user: User) {
    if (user.token) {
      this.notificationSvc.subscribeToTopic(user.token, 'general').subscribe({
        next: () => console.log(`Suscripción exitosa (general) para ${user.name}`),
        error: (err) => console.error(`Error al suscribir (general) a ${user.name}:`, err)
      });
    }
  }
  
  subscribeToBoatTopic(user: User) {
    if (user.token) {
      this.notificationSvc.subscribeToTopic(user.token, 'boat').subscribe({
        next: () => console.log(`Suscripción exitosa (airplane) para ${user.name}`),
        error: (err) => console.error(`Error al suscribir (airplane) a ${user.name}:`, err)
      });
    }
  }
  
  subscribeToCarTopic(user: User) {
    if (user.token) {
      this.notificationSvc.subscribeToTopic(user.token, 'car').subscribe({
        next: () => console.log(`Suscripción exitosa (car) para ${user.name}`),
        error: (err) => console.error(`Error al suscribir (car) a ${user.name}:`, err)
      });
    }
  }




  //enviar notificaciones por nivel


  enviarNotificacionNivel(nivel: number) {
    this.utilsSvc.presentAlert({
      header: `Enviar a Nivel ${nivel}`,
      inputs: [
        {
          name: 'title',
          placeholder: 'Título (máx. 30 caracteres)',
          attributes: { maxlength: 30 }
        },
        {
          name: 'body',
          type: 'textarea',
          placeholder: 'Contenido de la notificación'
        }
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Enviar',
          handler: (res) => {
            const { title, body } = res;
  
            if (title && body) {
              const message: Notification = { title, body };
              this.notificationSvc.sendNotificationToLevel(nivel, message).subscribe({
                next: (r) => {
                  console.log(`✅ Notificación enviada a nivel ${nivel}`, r);
                  this.utilsSvc.presentToast({
                    message: `Notificación enviada a nivel ${nivel}`,
                    duration: 2500,
                    color: 'success'
                  });
                },
                error: (err) => {
                  console.error(`❌ Error enviando a nivel ${nivel}`, err);
                  this.utilsSvc.presentToast({
                    message: `Error al enviar notificación`,
                    duration: 2500,
                    color: 'danger'
                  });
                }
              });
            } else {
              this.utilsSvc.presentToast({
                message: 'Completa todos los campos',
                duration: 2500,
                color: 'warning'
              });
            }
  
            return true;
          }
        }
      ]
    });
  }
  
  

}
