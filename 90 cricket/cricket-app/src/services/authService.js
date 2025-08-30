import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, twitterProvider } from '../firebase';

export class AuthService {
  // Email and Password Authentication
  static async signUpWithEmail(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: displayName
      });

      // Save user data to Firestore
      await this.saveUserToFirestore(user, { displayName });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Social Authentication with Popup (fallback to redirect on COOP issues)
  static async signInWithGoogle(useRedirect = false) {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirect: true };
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore if new user
      await this.saveUserToFirestore(user);
      
      return { success: true, user };
    } catch (error) {
      // If popup is blocked or COOP policy issues, fallback to redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Popup authentication failed, falling back to redirect...', error.message);
        return this.signInWithGoogle(true);
      }
      return { success: false, error: error.message };
    }
  }

  static async signInWithFacebook(useRedirect = false) {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, facebookProvider);
        return { success: true, redirect: true };
      }
      
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      // Save user data to Firestore if new user
      await this.saveUserToFirestore(user);
      
      return { success: true, user };
    } catch (error) {
      // If popup is blocked or COOP policy issues, fallback to redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Popup authentication failed, falling back to redirect...', error.message);
        return this.signInWithFacebook(true);
      }
      return { success: false, error: error.message };
    }
  }

  static async signInWithTwitter(useRedirect = false) {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, twitterProvider);
        return { success: true, redirect: true };
      }
      
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      
      // Save user data to Firestore if new user
      await this.saveUserToFirestore(user);
      
      return { success: true, user };
    } catch (error) {
      // If popup is blocked or COOP policy issues, fallback to redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Popup authentication failed, falling back to redirect...', error.message);
        return this.signInWithTwitter(true);
      }
      return { success: false, error: error.message };
    }
  }

  // Handle redirect result (call this on app initialization)
  static async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        // Save user data to Firestore if new user
        await this.saveUserToFirestore(result.user);
        return { success: true, user: result.user };
      }
      return { success: true, user: null };
    } catch (error) {
      console.error('Error handling redirect result:', error);
      return { success: false, error: error.message };
    }
  }

  // Password Reset
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign Out
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Authentication State Observer
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get Current User
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Save User to Firestore
  static async saveUserToFirestore(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Create user document with default role if it doesn't exist
    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.displayName || '',
        photoURL: user.photoURL || '',
        role: 'user', // Default role
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        ...additionalData
      };

      try {
        await setDoc(userRef, userData);
      } catch (error) {
        console.error('Error saving user to Firestore:', error);
      }
    } else {
      // Update last login time and merge any new data
      try {
        await setDoc(userRef, {
          lastLoginAt: new Date().toISOString(),
          // Ensure user has a role (backward compatibility)
          role: userSnap.data().role || 'user',
          ...additionalData
        }, { merge: true });
      } catch (error) {
        console.error('Error updating user login time:', error);
      }
    }
  }

  // Get User Data from Firestore
  static async getUserData(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: 'User data not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}