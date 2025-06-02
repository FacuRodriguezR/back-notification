import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }


 async submit(){
    if(this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        console.log(res);

        this.getUserInfo(res.user.uid);
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        
      }).finally(()=> {
        loading.dismiss();
      })
    }
    
  }


  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
 

      this.firebaseSvc.getDocument(path).then((user: User) => {


        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 1500,
          color: 'danger',
          position: 'middle',
          icon: 'person-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }

  }

  async loginWithGoogle() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      const res = await this.firebaseSvc.signInWithGoogle();
      if (res) {
        // Verifica si el usuario ya existe en la base de datos
        const userExists = await this.checkIfUserExists(res.user.uid);
        
        if (!userExists) {
          // Crea el usuario en la base de datos si no existe
          const path = `users/${res.user.uid}`;
          const userData: Partial<User> = {
            uid: res.user.uid,
            email: res.user.email,
            name: res.user.displayName,
        
           
          };
          
          await this.firebaseSvc.setDocument(path, userData);
        }
        
        this.getUserInfo(res.user.uid);
      }
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
  
  async checkIfUserExists(uid: string): Promise<boolean> {
    const path = `users/${uid}`;
    const user = await this.firebaseSvc.getDocument(path);
    return !!user;
  }

  

  

}
