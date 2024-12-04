const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Create the scheduled function
exports.resetDailyUserData = functions.pubsub
  .schedule('0 0 * * *') // Runs at midnight every day
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      // Get all users
      const usersSnapshot = await admin.firestore().collection('users').get();

      // Batch updates for better performance
      const batch = admin.firestore().batch();

      usersSnapshot.forEach((doc) => {
        // Reset daily values for each user
        batch.update(doc.ref, {
          'dailies.status': 'active', // Reset all dailies to unchecked
          'habits.level': 0, // Reset habit levels to 0
          lastResetDate: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      // Commit all updates
      await batch.commit();

      console.log(
        `Successfully reset daily data for ${usersSnapshot.size} users`
      );
      return null;
    } catch (error) {
      console.error('Error resetting daily user data:', error);
      throw error;
    }
  });
