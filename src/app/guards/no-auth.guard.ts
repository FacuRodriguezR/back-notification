import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {

  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  let user = localStorage.getItem('user');

  return new Promise<boolean>((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        // Si el usuario está autenticado, redirige a la página principal
        utilsSvc.routerLink('/main/home');
        resolve(false);  // No permite el acceso a la ruta no autenticada
      } else {
        // Si no está autenticado, permite el acceso
        resolve(true);
      }
    });
  });
};