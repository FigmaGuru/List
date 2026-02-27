import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA3_82o-rgtOk4beLuViebV7LUmF1fP8do',
  authDomain: 'list-b5e56.firebaseapp.com',
  projectId: 'list-b5e56',
  storageBucket: 'list-b5e56.firebasestorage.app',
  messagingSenderId: '514123620203',
  appId: '1:514123620203:web:9b02c096a8cf6f1f0ab62e',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
