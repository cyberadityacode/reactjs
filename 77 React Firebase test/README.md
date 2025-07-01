# React Hello World with Firebase

Let’s now create a **"Hello World" React application** and deploy it using **Firebase Hosting**.

---

##  Final Goal:

 Build a simple React app that displays `Hello World from Firebase + React`
 Host it live using Firebase Hosting

---

##  Step-by-Step Guide

###  Prerequisites:

* Node.js + npm installed
* Firebase CLI installed (`npm install -g firebase-tools`)
* Firebase project created on [console.firebase.google.com](https://console.firebase.google.com)
* Logged in to Firebase (`firebase login`)

---

###  Step 1: Create React App

```bash
npx create-react-app firebase-react-hello
cd firebase-react-hello
```

---

###  Step 2: Modify App Content

Edit `src/App.js` to show “Hello World”:

```js
function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Hello World from Firebase + React</h1>
    </div>
  );
}

export default App;
```

---

###  Step 3: Build the React App

```bash
npm run build
```

This creates a `build/` folder with your production files.

---

###  Step 4: Initialize Firebase Hosting

```bash
firebase init
```

 During the setup:

* Select **Hosting** only.
* Select your Firebase project.
* Set **`dist`** as your public directory.
* Choose **No** for single-page app redirect (for now).
* Choose **No** to overwrite `index.html` if prompted.

---

###  Step 5: Deploy to Firebase Hosting

```bash
firebase deploy
```

You’ll get a live URL like:

```
  Hosting URL: https://adityadubeytest.web.app/
```

---

##  DONE!

---


We will Develop the Following soon

* Firebase **Authentication**
* Firebase **Firestore/Database**
* A **Contact Form** that saves user messages
* **Live Chat** with Realtime DB


---


## Example Combo

Let’s say you want:

Home + About + Projects (React)

Blog (via WordPress)

Contact Form (React + Firebase)

That’s a perfect setup.

## Create Firebase-based contact form?