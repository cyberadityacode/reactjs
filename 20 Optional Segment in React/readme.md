# Optional Segment ?

An optional segment in a URL path means a part of the route that may or may not be present. For example:
```jsx
<Route path="/users/:userId?" element={<User />} />
```

Here, :userId? makes the userId parameter optional.

* /users → Matches

* /users/123 → Also matches

The ? after :userId makes that segment optional.

> Optional Chaining (?.) — Often called "optional segment"

It allows you to safely access nested properties without causing a runtime error if a value is null or undefined.

```js
const user = {
  name: "Rahul",
  address: {
    city: "Mumbai",
  },
};

// Traditional way (may throw error if address is undefined)
console.log(user.address.city);

// Using optional chaining
console.log(user.address?.city);     // ✅ "Mumbai"
console.log(user.contact?.email);    // ✅ undefined (no error)


```
### Use cases:
- Accessing object properties: obj?.prop

- Calling functions: obj?.method()

- Accessing array items: arr?.[index]

# {/_ Using Custom Class in Navigation, it will apply className - custom-active if navlink is active and vice-versa _/}

```jsx
<NavLink className={({isActive}) => isActive?'custom-active' : 'not-active'} to="/login">Login</NavLink>
```


In React, when you're using **`NavLink`** from **React Router**, you can apply a **custom class** (including dynamic ones) using the `className` prop. This prop accepts a **function** that receives an object with the `isActive` property — which you can use to apply different classes depending on whether the link is active.

---

### ✅ Example: Using Custom Class in `NavLink`

```jsx
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "nav-link active-link" : "nav-link"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "nav-link active-link" : "nav-link"
        }
      >
        About
      </NavLink>
    </nav>
  );
}
```

---

### 💡 Explanation

* `"nav-link"` is your **custom base class**.
* `"active-link"` is **added only when the route is active**.
* `isActive` is automatically passed by React Router.

---

### 🔧 Custom Styling with Tailwind or CSS

If using **Tailwind CSS**:

```jsx
className={({ isActive }) =>
  isActive ? "text-blue-600 font-bold" : "text-gray-500"
}
```

If using **CSS classes**:

```css
.nav-link {
  color: gray;
  text-decoration: none;
}

.active-link {
  color: blue;
  font-weight: bold;
}
```

