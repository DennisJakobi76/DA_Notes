import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'danotes-412b6',
          appId: '1:750661716843:web:81c9aa9704c9368e439a2e',
          storageBucket: 'danotes-412b6.firebasestorage.app',
          apiKey: 'AIzaSyAHT-BIWgfvUOG4ps3QSu3mUKClPrQLTjY',
          authDomain: 'danotes-412b6.firebaseapp.com',
          messagingSenderId: '750661716843',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
