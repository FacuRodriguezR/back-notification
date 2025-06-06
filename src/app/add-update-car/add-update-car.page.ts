import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { AddUpdateComponent } from '../shared/components/add-update/add-update.component';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehiculo.model';

@Component({
  selector: 'app-add-update-car',
  templateUrl: './add-update-car.page.html',
  styleUrls: ['./add-update-car.page.scss'],
})
export class AddUpdateCarPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  vehicleSubscription: any;

  vehicles: Vehicle[] = [];
  constructor() {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getProducts();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  getProducts() {
    const path = `users/${this.user().uid}/vehiculos`;
    if (this.vehicleSubscription) {
      this.vehicleSubscription.unsubscribe();
    }
    this.vehicleSubscription = this.firebaseSvc
      .getCollectionData(path)
      .subscribe({
        next: (res: any) => {
          this.vehicles = res;
        },
      });
  }

  ionViewDidLeave() {
    if (this.vehicleSubscription) {
      this.vehicleSubscription.unsubscribe();
    }
  }

  // agregar o actualizar auto
  addUpdateCar() {
    this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
    });
  }

  async deleteVehicle(vehicle: Vehicle) {
    const confirmado = await this.utilsSvc.presentAlertConfirm({
      header: 'Eliminar vehículo',
      message: '¿Estás seguro de que deseas eliminar este vehículo?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (!confirmado) return;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    const path = `users/${this.user().uid}/vehiculos`;

    try {
      // 1. Eliminar el documento por ID (ideal si lo tenés) o por campo 'patente'
      await this.firebaseSvc.deleteDocumentByField(
        path,
        'patente',
        vehicle.patente
      );

      // 2. Eliminar imagen del Storage usando el imagePath guardado
      if (vehicle.imagePath) {
        await this.firebaseSvc.deleteFileFromStorage(vehicle.imagePath);
      }

      this.utilsSvc.presentToast({
        message: 'Vehículo eliminado correctamente',
        color: 'success',
        duration: 2000,
      });

      this.getProducts();
    } catch (err) {
      console.error(err);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar el vehículo o la imagen',
        color: 'danger',
        duration: 2000,
      });
    } finally {
      await loading.dismiss();
    }
  }
}
