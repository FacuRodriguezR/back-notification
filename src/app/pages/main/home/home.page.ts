import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { Coupon, Events } from 'src/app/models/coupon';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string; 
  couponsActive: boolean;
  points: number;
  level: number;
  user: User;
  uid: string;
  

  public coupons: Coupon[];
  public events: Events[];
  swiperModules = [IonicSlides];

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService, private router: Router) { 
    this.couponsActive = false;
  }

  ngOnInit() {
    this.getName();
    this.utilsSvc.getCoupons().then((coupons:Coupon[]) =>{
      this.coupons = coupons;
      console.log(this.coupons);
      
    });

    this.loadEvents();
    
  }

  ionViewWillEnter(){
    this.getCurrentUser()
  }

  getCurrentUser(){
    let currentUser = this.utilsSvc.getFromLocalStorage('user');
    if (!currentUser || !currentUser.uid) {
      console.error('No hay usuario logueado');
      return;
    }
  
    const path = `users/${currentUser.uid}`;
    const sub = this.firebaseSvc.getDocData(path).subscribe({
      next: (res: any) => {
        console.log('Usuario:', res);
        this.user = res;
        sub.unsubscribe();
      },
      error: (err) => console.error('Error al traer usuario:', err)
    });
  }


  signOut(){
    this.firebaseSvc.signOut();
  }

  changeActive(coupon: Coupon) {
    this.coupons.forEach(c => c.active = false);  // Desactiva todos los cupones
    coupon.active = true;                         // Activa solo el cupón seleccionado
    this.couponsActive = true;                    // Marca que hay cupones activos
  }

  getName() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user && user.name) {
      this.userName = user.name;
      this.points = user.points;
      this.level = user.level;
      
      
    }
  }

  

  goToCard() {
    const activeCoupons = this.coupons.filter((c) => c.active);
    this.router.navigate(['card-coupon'], { state: { coupons: activeCoupons } }); // Navega y pasa los datos
  }

  onSlideClick(coupon: Coupon) {
    this.changeActive(coupon);  // Activar el cupón
    this.goToCard();            // Generar el QR y redirigir
  }


  async loadEvents() {
    try {
      this.events = await this.utilsSvc.getEvents();
      console.log('Eventos:', this.events);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  


}
