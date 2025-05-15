##  Proof Of Concept: Best TODO App

A clean and responsive React-based Todo application that demonstrates key concepts like component-based design, state management, filtering, and persistent storage using `localStorage`.

---

###  Key Features

*  **Add Tasks** – Quickly add new todo items.
*  **View & Filter Tasks** – Toggle between **All**, **Active**, and **Completed** tasks.
* **Delete / Mark as Complete** – Manage your tasks with ease.
*  **Persistent State** – All todos and filters are saved in `localStorage`, so your data stays even after refreshing the page.
*  **Task Counter** – Shows how many tasks remain.
*  **Component-Based Architecture** – Clean separation via modular components:

  * `TodoAdd`
  * `TodoShowTask`
  * `TodoTaskRemaining`
  * `TodoListTask`

---

### Tech Stack

* **React (Functional Components & Hooks)**
* **TailwindCSS** for styling
* **localStorage** for data persistence

---

###  How to Run

```bash
# Clone the repo
git clone https://github.com/your-username/best-todo-app.git

# Navigate to the project directory
cd best-todo-app

# Install dependencies
npm install

# Run the app
npm start
```


Live Demo : https://cyberadityatodo.netlify.app/