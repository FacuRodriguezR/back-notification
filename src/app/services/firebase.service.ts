import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from 'firebase/auth';
import {getFirestore, setDoc, doc, getDoc, collection, collectionData, query, docData} from '@angular/fire/firestore'
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {



  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private utilsService: UtilsService) {}

  // Autenticación
  getAuth(){
    return getAuth();
  }

  // --- Acceder ---
  signIn(user: User) {
    // Usa directamente AngularFireAuth para la autenticación
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }
  // --- Crear User ---
  signUp(user: User) {
    // Usa directamente AngularFireAuth para la autenticación
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

    // --- Actualizar usuario ---

    updateUser(displayName: string) {
      return this.afAuth.currentUser.then(user => {
        if (user) {
          return updateProfile(user, { displayName });
        } else {
          throw new Error("No hay un usuario autenticado.");
        }
      });
    }

    sendRecoveryEmail(email: string){
      return this.afAuth.sendPasswordResetEmail(email);
    }

    getCollectionData(path: string, collectionQuery?: any) {
      const ref = collection(getFirestore(), path);
      return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
    }

    getDocData(path: string) {
      const ref = doc(getFirestore(), path);
      return docData(ref, { idField: 'id' });
    }
    
    // Base de datos
    
    
    // setear un doc---

    setDocument( path: string, data: any){
      return setDoc(doc(getFirestore(), path), data)
    }

    // obtener un documento

    async getDocument(path: string){
      return (await getDoc(doc(getFirestore(), path))).data();
    }

    // sign-out

    signOut(){
    this.afAuth.signOut();
      localStorage.removeItem('user');
      this.utilsService.routerLink('/auth');
    }
}