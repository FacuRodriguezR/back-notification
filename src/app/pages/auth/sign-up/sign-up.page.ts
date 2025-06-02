import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Notification } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),

    dni: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(8),
    ]),
    token: new FormControl(localStorage.getItem('token')),
    points: new FormControl(0),
    level: new FormControl(1),
    telephone: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    gender: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    locality: new FormControl('', [Validators.required]),
    dateBirth: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  notificationSvc = inject(NotificationsService);

  provincias = [
    { label: 'Buenos Aires', value: 'Buenos Aires' },
    { label: 'Catamarca', value: 'Catamarca' },
    { label: 'Chaco', value: 'Chaco' },
    { label: 'Chubut', value: 'Chubut' },
    { label: 'Córdoba', value: 'Córdoba' },
    { label: 'Corrientes', value: 'Corrientes' },
    { label: 'Entre Ríos', value: 'Entre Ríos' },
    { label: 'Formosa', value: 'Formosa' },
    { label: 'Jujuy', value: 'Jujuy' },
    { label: 'La Pampa', value: 'La Pampa' },
    { label: 'La Rioja', value: 'La Rioja' },
    { label: 'Mendoza', value: 'Mendoza' },
    { label: 'Misiones', value: 'Misiones' },
    { label: 'Neuquén', value: 'Neuquén' },
    { label: 'Río Negro', value: 'Río Negro' },
    { label: 'Salta', value: 'Salta' },
    { label: 'San Juan', value: 'San Juan' },
    { label: 'San Luis', value: 'San Luis' },
    { label: 'Santa Cruz', value: 'Santa Cruz' },
    { label: 'Santa Fe', value: 'Santa Fe' },
    { label: 'Santiago del Estero', value: 'Santiago del Estero' },
    { label: 'Tierra del Fuego', value: 'Tierra del Fuego' },
    { label: 'Tucumán', value: 'Tucumán' },
    {
      label: 'Ciudad Autónoma de Buenos Aires',
      value: 'Ciudad Autónoma de Buenos Aires',
    },
  ];

  constructor() {}

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signUp(this.form.value as User)
        .then((res) => {
          this.firebaseSvc.updateUser(this.form.value.name);

          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);

          this.setUserInfo(uid);
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebaseSvc
        .setDocument(path, this.form.value)
        .then((res) => {
          this.subscribeToGeneralTopic();

          this.utilsSvc.saveInLocalStorage('user', this.form.value);
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  subscribeToGeneralTopic() {
    const token = localStorage.getItem('token');
    this.notificationSvc.subscribeToTopic(token, 'general');
  }
}
