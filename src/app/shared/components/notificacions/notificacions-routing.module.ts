import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionsPage } from './notificacions.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionsPageRoutingModule {}
