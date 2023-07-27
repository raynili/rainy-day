import { initializeApp } from 'firebase/app';
import { 
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    // methods below are for uploading data to firestore
    collection,
    writeBatch,
    query,
    getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDVLnNIhFbtbA81s4pw0RIOC6zGnQF4CMI",
    authDomain: "rainy-day-db.firebaseapp.com",
    projectId: "rainy-day-db",
    storageBucket: "rainy-day-db.appspot.com",
    messagingSenderId: "64328625855",
    appId: "1:64328625855:web:d159fdab6aec2e71b7200a"
};
  
// Initialize Firebase instance
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore(); // create one db singleton instance

// Upload product data into Firebase ~~~~~~~~~~~~~~~

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    // as long as we try to find something in database, Firebase will make one for us, even if not populated
    const collectionRef = collection(db, collectionKey);

    // batch write for many objects
    const batch = writeBatch(db); //create batch instance, can attach write/deletes to the batch

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase()); // call collectionRef instead of db, firebase knows the db the collectionRef is from
        // ^ will return pointer to doc even if didn't exist
        // ^ sets value (object.title) to that location
        batch.set(docRef, object);
    });

    await batch.commit(); //fires off

    console.log('done');
};

// Get product data into Firebase ~~~~~~~~~~~~~~~

export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => { //acc = accumulator
        const { title, items } = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    }, {}) // gives array of all indivd documents, reduce over to create json structure, init to empty object {}

    return categoryMap;
}

// Authentication of Users ~~~~~~~~~~~~~~~

export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid); // db instance, collection, unique userID
    // no data in the db, but just create a reference to this new document to set data later

    const userSnapshot = await getDoc(userDocRef); // special object with user data

    // if user data does not exist
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    // check if user data exists
    return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
  
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
  
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback); 
// calls callback function that was passed in when our auth singleton changes
// e.g when user signs in or out