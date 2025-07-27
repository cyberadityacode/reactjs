# Firebase Realtime Database Prototype - Check online or Offline Status

You mark yourself online when you open the app.

You leave a signal to automatically go offline if you close/crash.

You watch the other person’s online/offline status in real-time.

React shows you a live indicator like WhatsApp or Messenger.

---

###  Imagine This App is a Party Hall

* You have **two friends**: `Aditya` and `Pramod`.
* Each friend can walk into or leave the party (the app).
* You want to **see if your friend is in the party** (online) or not (offline).
* And when they leave, they should **automatically be marked as gone**, even if they suddenly vanish (close tab, crash, etc.)

---

###  Code Explained with Real-World Metaphors

```js
const otherUserId = currentUserid === "aditya" ? "pramod" : "aditya";
```

 *"If I'm Aditya, then the other person must be Pramod. If I'm Pramod, the other person is Aditya."*
This lets you **see your friend’s status**.

---

```js
const [otherUserStatus, setOtherUserStatus] = useState("offline");
```

 *"Let me keep a note of my friend’s current status — either 'online' or 'offline'."*
(React state to store what your friend is doing.)

---

###  useEffect 1 – Tell the World “I’m Here!”

```js
const userStatusRef = ref(db, `/status/${currentUserid}`);
const connectedRef = ref(db, ".info/connected");
```

*Setting up two things:*

* `userStatusRef`: where your name is written on the guestlist
* `connectedRef`: Firebase’s **heartbeat monitor** — it tells if you're connected or not.

---

```js
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    onDisconnect(userStatusRef).set("offline");
    set(userStatusRef, "online");
  }
});
```

 *"If I’m truly connected to the internet..."*

*  `onDisconnect(...).set("offline")`:
  Think of this like **leaving a note on the door**:
  *“If I vanish suddenly (e.g., close the tab), please mark me as offline.”*

*  `set(userStatusRef, "online")`:
  *"Since I’m here now, mark me online on the guest list!"*

---

```js
return () => {
  set(userStatusRef, "offline");
};
```

 *"If I quietly leave the app (component unmounts), also mark me offline."*
So, even if you leave gently, it updates your status.

---

###  useEffect 2 – Watch What My Friend is Doing

```js
const otherStatusRef = ref(db, `/status/${otherUserId}`);
```

 *"Let me look at my friend's name in the guest list..."*

---

```js
onValue(otherStatusRef, (snap) => {
  setOtherUserStatus(snap.val() || "offline");
});
```

*"Any time their status changes (online/offline), let me know and I’ll update what I display."*
This is **live listening** — like having a spy checking the door every second.

---

###  UI – Showing the Friend’s Status

```js
<h3>
  {otherUserId} is: 
  <span style={{ color: otherUserStatus === "online" ? "green" : "red" }}>
    {otherUserStatus}
  </span>
</h3>
```

 *"Let me show clearly whether my friend is in the party (green = online) or not (red = offline)."*



---
