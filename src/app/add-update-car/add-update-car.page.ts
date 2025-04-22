import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { AddUpdateComponent } from '../shared/components/add-update/add-update.component';

@Component({
  selector: 'app-add-update-car',
  templateUrl: './add-update-car.page.html',
  styleUrls: ['./add-update-car.page.scss'],
})
export class AddUpdateCarPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  // agregar o actualizar auto
  addUpdateCar(){
    this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal'
    })
  }

}
