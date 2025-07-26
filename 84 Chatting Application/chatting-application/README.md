## `App.jsx` – Entry Point of the App

This is your main app file that:

###  1. **Manages which user is active**

* You're simulating a **two-user chat** by toggling between `user1` and `user2`.
* `userId` is stored in state and changes when you click the **"Switch User"** button.

```jsx
const [userId, setUserId] = useState("user1");
```

This line stores which user is currently active.

```jsx
<ChatRoom chatId="chat123" currentUserId={userId} />
```

You pass this `userId` to the `ChatRoom` component to show messages from that user's perspective.

---

##  `ChatRoom.jsx` – Handles the Messaging

This is the actual chat screen where messages are sent and received. Here's what it does:

---

###  1. **Loads messages in real-time**

```js
useEffect(() => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
  return () => unsubscribe();
}, [chatId]);
```

* Listens for changes in the `"messages"` subcollection inside `"chats/chat123"`.
* When someone sends a message, it updates **immediately** for both users in real time.
* Messages are ordered by timestamp (so they're in the correct order).

---

### 2. **Tracks who is typing**

```js
useEffect(() => {
  const chatDocRef = doc(db, "chats", chatId);
  const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
    const data = docSnap.data();
    if (data?.typing) {
      setTyping(data.typing);
    }
  });
  return () => {
    unsubscribe();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
}, [chatId]);
```

* This listens to the `typing` status stored in the chat document.
* If the other user (`targetUserId`) is typing, it shows **"user2 is typing..."** in the chat.

---

###  3. **Updates typing status when typing**

```js
const handleInputChange = (e) => {
  setText(e.target.value);
  updateTypingStatus(true);

  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

  typingTimeoutRef.current = setTimeout(() => {
    updateTypingStatus(false);
  }, 1000);
};
```

* When the user types in the text input:

  * It marks them as `typing: true`.
  * If they stop typing for 1 second, it switches to `typing: false`.

---

###  4. **Sends messages to Firestore**

```js
await addDoc(collection(db, "chats", chatId, "messages"), {
  text,
  sender: currentUserId,
  timestamp: new Date(),
});
```

* Adds the new message to:

  * `chats/chat123/messages/`
* Each message contains:

  * `text` – the message text
  * `sender` – `user1` or `user2`
  * `timestamp` – for sorting

---

###  5. **UI Behavior**

```jsx
{messages.map((msg) => (
  <div className={`message ${msg.sender === currentUserId ? "own" : ""}`}>
    <strong>{msg.sender}: </strong>
    {msg.text}
  </div>
))}
```

* This loops through all messages.
* If the message is from the current user, it adds a `"own"` CSS class.
* Displays the sender name and message text.

---

##  Firebase Firestore Structure (Schema)

To support this code, your Firestore should be structured like this:

```
chats (collection)
 └── chat123 (document)
     ├── typing: {
     │     user1: true/false,
     │     user2: true/false
     │ }
     └── messages (subcollection)
         ├── msg1 (document)
         │    ├── text: "Hello"
         │    ├── sender: "user1"
         │    └── timestamp: <Timestamp>
         ├── msg2 (document)
              ...
```

---

##  Summary (as your mentor)

You're building a solid real-time 2-way chat:

| Feature                   | Working? |
| ------------------------- | -------- |
| Real-time messaging       | ✅        |
| Typing indicator          | ✅        |
| User switching simulation | ✅        |
| Firebase integration      | ✅        |

---

##  What's Next?

Here’s what you can add next:

1. ✅ **Unread messages counter**
2. ✅ **Message read indicators (e.g., ✓✓ Seen)**
3. ✅ **User list or contacts panel**
4. ✅ **User authentication**
5. ✅ **File or image sending**
6. ✅ **Emoji support or rich messages**

Want to proceed with **unread message counter** or something else?
