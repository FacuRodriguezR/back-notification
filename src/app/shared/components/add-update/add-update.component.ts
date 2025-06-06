import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  MaxLengthValidator,
} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  vehiculoForm: FormGroup;
  uid: string;
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      image: ['', Validators.required],
      patente: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(7)],
      ],
      modelo: ['', Validators.required],
      ano: [null, [Validators.required, Validators.min(1900)]],
      tipo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.utilsService.getFromLocalStorage('user');
    this.uid = user?.uid;
    console.log('UID:', this.uid);
  }

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del producto'))
      .dataUrl;
    this.vehiculoForm.controls['image'].setValue(dataUrl);
  }

  async guardarVehiculo() {
    if (this.vehiculoForm.valid) {
      const path = `users/${this.uid}/vehiculos`;
      const loading = await this.utilsService.loading();
      await loading.present();

      try {
        const dataUrl = this.vehiculoForm.value.image;
        const imagePath = `${path}/${Date.now()}`;
        const imageUrl = await this.firebaseService.uploadImage(
          imagePath,
          dataUrl
        );

        const vehiculoData = {
          ...this.vehiculoForm.value,
          imageUrl,
          imagePath,
        };

        await this.firebaseService.addVehiculo(path, vehiculoData);

        this.utilsService.dismissModal({ success: true });

        this.utilsService.presentToast({
          message: 'Vehículo creado exitosamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      } catch (error) {
        console.error(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
