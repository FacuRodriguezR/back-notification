import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {

  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  let user = localStorage.getItem('user');

  return new Promise<boolean>((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        // Si el usuario está autenticado, permite el acceso
        resolve(true);
      } else {
        // Si no está autenticado, redirige al login y resuelve false
        utilsSvc.routerLink('/auth');
        resolve(false);
      }
    });
  });

 
};