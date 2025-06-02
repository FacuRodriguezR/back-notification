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
    let path = `users/${this.user().uid}/vehiculos`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.vehicles = res;
        sub.unsubscribe();
      },
    });
  }

  // agregar o actualizar auto
  addUpdateCar() {
    this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
    });
  }
}
