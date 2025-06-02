import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionsPageRoutingModule } from './notificacions-routing.module';

import { NotificacionsPage } from './notificacions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionsPageRoutingModule
  ],
  declarations: [NotificacionsPage]
})
export class NotificacionsPageModule {}
