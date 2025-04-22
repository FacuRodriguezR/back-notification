import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateCarPageRoutingModule } from './add-update-car-routing.module';

import { AddUpdateCarPage } from './add-update-car.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUpdateCarPageRoutingModule,
    SharedModule
  ],
  declarations: [AddUpdateCarPage]
})
export class AddUpdateCarPageModule {}
