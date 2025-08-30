import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// User roles constants
export const USER_ROLES = {
  USER: 'user',
  UMPIRE: 'umpire',
  ADMIN: 'admin'
};

export class RoleService {
  // Assign role to a user
  static async assignRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: role,
        roleAssignedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user role
  static async getUserRole(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { success: true, role: userData.role || USER_ROLES.USER };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user has specific role
  static async hasRole(userId, requiredRole) {
    const result = await this.getUserRole(userId);
    return result.success && result.role === requiredRole;
  }

  // Check if user is umpire
  static async isUmpire(userId) {
    return await this.hasRole(userId, USER_ROLES.UMPIRE);
  }

  // Check if user is admin
  static async isAdmin(userId) {
    return await this.hasRole(userId, USER_ROLES.ADMIN);
  }

  // Get all users with specific role
  static async getUsersByRole(role) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', role)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, users };
    } catch (error) {
      console.error('Error getting users by role:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all umpires
  static async getAllUmpires() {
    return await this.getUsersByRole(USER_ROLES.UMPIRE);
  }

  // Remove role from user (set back to regular user)
  static async removeRole(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: USER_ROLES.USER,
        roleRemovedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error removing role:', error);
      return { success: false, error: error.message };
    }
  }

  // Create initial admin user (run once) - Updated to handle permissions
  static async createInitialAdmin(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Use setDoc with merge instead of updateDoc to handle permissions better
        await setDoc(userRef, {
          role: USER_ROLES.ADMIN,
          isInitialAdmin: true,
          roleAssignedAt: new Date().toISOString()
        }, { merge: true });
        return { success: true };
      } else {
        // If user document doesn't exist, create it with admin role
        await setDoc(userRef, {
          role: USER_ROLES.ADMIN,
          isInitialAdmin: true,
          roleAssignedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating initial admin:', error);
      return { success: false, error: error.message };
    }
  }
}