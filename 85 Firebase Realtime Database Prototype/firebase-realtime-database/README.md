# Firebase Realtime Database Prototype - Check online or Offline Status

You mark yourself online when you open the app.

You leave a signal to automatically go offline if you close/crash.

You watch the other person’s online/offline status in real-time.

React shows you a live indicator like WhatsApp or Messenger.

---

### Imagine This App is a Party Hall

- You have **two friends**: `Aditya` and `Pramod`.
- Each friend can walk into or leave the party (the app).
- You want to **see if your friend is in the party** (online) or not (offline).
- And when they leave, they should **automatically be marked as gone**, even if they suddenly vanish (close tab, crash, etc.)

---

### Code Explained with Real-World Metaphors

```js
const otherUserId = currentUserid === "aditya" ? "pramod" : "aditya";
```

_"If I'm Aditya, then the other person must be Pramod. If I'm Pramod, the other person is Aditya."_
This lets you **see your friend’s status**.

---

```js
const [otherUserStatus, setOtherUserStatus] = useState("offline");
```

_"Let me keep a note of my friend’s current status — either 'online' or 'offline'."_
(React state to store what your friend is doing.)

---

### useEffect 1 – Tell the World “I’m Here!”

```js
const userStatusRef = ref(db, `/status/${currentUserid}`);
const connectedRef = ref(db, ".info/connected");
```

_Setting up two things:_

- `userStatusRef`: where your name is written on the guestlist
- `connectedRef`: Firebase’s **heartbeat monitor** — it tells if you're connected or not.

---

```js
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    onDisconnect(userStatusRef).set("offline");
    set(userStatusRef, "online");
  }
});
```

_"If I’m truly connected to the internet..."_

- `onDisconnect(...).set("offline")`:
  Think of this like **leaving a note on the door**:
  _“If I vanish suddenly (e.g., close the tab), please mark me as offline.”_

- `set(userStatusRef, "online")`:
  _"Since I’m here now, mark me online on the guest list!"_

---

```js
return () => {
  set(userStatusRef, "offline");
};
```

_"If I quietly leave the app (component unmounts), also mark me offline."_
So, even if you leave gently, it updates your status.

---

### useEffect 2 – Watch What My Friend is Doing

```js
const otherStatusRef = ref(db, `/status/${otherUserId}`);
```

_"Let me look at my friend's name in the guest list..."_

---

```js
onValue(otherStatusRef, (snap) => {
  setOtherUserStatus(snap.val() || "offline");
});
```

_"Any time their status changes (online/offline), let me know and I’ll update what I display."_
This is **live listening** — like having a spy checking the door every second.

---

### UI – Showing the Friend’s Status

```js
<h3>
  {otherUserId} is:
  <span style={{ color: otherUserStatus === "online" ? "green" : "red" }}>
    {otherUserStatus}
  </span>
</h3>
```

_"Let me show clearly whether my friend is in the party (green = online) or not (red = offline)."_

---

How It Works
useRef stores the previous status (offline by default).

When pramod goes from offline ➝ online:

It plays a ping sound.

Updates document.title to show he's online.

After 5 seconds, resets the tab title.
