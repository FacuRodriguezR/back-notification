import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUpdateCarPage } from './add-update-car.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateCarPageRoutingModule {}
