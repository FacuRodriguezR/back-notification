import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'card-coupon',
    loadChildren: () => import('./card-coupon/card-coupon.module').then( m => m.CardCouponPageModule)
  },
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then( m => m.SucursalesPageModule)
  },
  {
    path: 'add-update-car',
    loadChildren: () => import('./add-update-car/add-update-car.module').then( m => m.AddUpdateCarPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/main/profile/profile.module').then( m => m.ProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
