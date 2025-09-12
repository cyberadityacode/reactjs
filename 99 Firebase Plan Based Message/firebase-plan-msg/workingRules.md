rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usage document per user
    match /usage/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Chat messages
    match /chats/{chatId}/messages/{messageId} {

      function canRead(uid) {
        let usage = get(/databases/$(database)/documents/usage/$(uid));
        return !usage.exists() ||
               (usage.data.plan == "pro"
                  ? usage.data.readCount < 50
                  : usage.data.readCount < 10);
      }

      function canWrite(uid) {
        let usage = get(/databases/$(database)/documents/usage/$(uid));
        return !usage.exists() ||
               (usage.data.plan == "pro"
                  ? usage.data.writeCount < 20
                  : usage.data.writeCount < 5);
      }

      allow read: if request.auth != null && canRead(request.auth.uid);
      allow create: if request.auth != null && canWrite(request.auth.uid);
      allow update, delete: if false;
    }
  }
}
