import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDTDckGqJHO02nPM5kh775lgF1GF_OTuhw',
  authDomain: 'cartographers-x.firebaseapp.com',
  projectId: 'cartographers-x',
  storageBucket: 'cartographers-x.appspot.com',
  messagingSenderId: '653019707582',
  appId: '1:653019707582:web:8e35771898e5f24f6486ef',
  measurementId: 'G-Z4VLE9W5ZK',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
