import { inject, Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  collectionData,
  query,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  uid: string;
  private app: any;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsService: UtilsService,
    private storage: AngularFireStorage
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Inicializa la app de Firebase solo si no existe
      this.app = initializeApp(environment.firebaseConfig);
      console.log('Firebase inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
    }
  }

  // Autenticación
  getAuth() {
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
    return this.afAuth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  // --- Actualizar usuario ---

  updateUser(displayName: string) {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return updateProfile(user, { displayName });
      } else {
        throw new Error('No hay un usuario autenticado.');
      }
    });
  }

  // FirebaseService

  // addVehiculo(vehiculo: any, uid: string) {
  //   const id = this.firestore.createId();

  //   console.log(uid)
  //   return this.setDocument(`users/${uid}/vehiculos/${id}`, { id, ...vehiculo });
  // }

  addVehiculo(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  sendRecoveryEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  getDocData(path: string) {
    const ref = doc(getFirestore(), path);
    return docData(ref, { idField: 'id' });
  }

  // Base de datos

  // setear un doc---

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
  deleteDocument(path: string, data: any) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // obtener desde una colecion

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // obtener un documento

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // eliminar product

  async deleteDocumentByField(
    path: string,
    field: string,
    value: any
  ): Promise<void> {
    const snapshot = await this.firestore
      .collection(path, (ref) => ref.where(field, '==', value))
      .get()
      .toPromise();

    const batch = this.firestore.firestore.batch();
    snapshot?.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  async deleteFileFromStorage(path: string): Promise<void> {
    const storage = getStorage();
    const fileRef = ref(storage, path);

    try {
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('No se pudo eliminar la imagen:', error);
      // Podés decidir si esto detiene el flujo o solo muestra una advertencia
    }
  }

  // sign-out

  signOut() {
    this.afAuth.signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
