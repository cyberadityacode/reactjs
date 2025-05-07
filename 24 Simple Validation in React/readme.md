# Simple Validation in React

- Create Input Fields and assign state defination to store data.
- Apply Validation in input fields
- Display Dynamic Error Message
- Disable Login if condition not fulfilled



---

###  The Regex :

```js
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/
```

---


1. **Anchors**:

   * `^` → Start of string
   * `$` → End of string
     It Ensures the pattern matches the *whole input*, not just part of it.

2. **Lookaheads**:
   These are like requirements that must be *true somewhere in the string*:

   * `(?=.*[a-z])` → There must be **at least one lowercase letter**
   * `(?=.*[A-Z])` → There must be **at least one uppercase letter**
   * `(?=.*\d)` → There must be **at least one digit**

3. **Main pattern**:

   * `[A-Za-z\d]{7,}`
     → The actual characters allowed: only **letters and digits**
     → Must be at least **7 characters long**

---

###  Memory Trick

>  “At least 1 **lowercase**, 1 **uppercase**, 1 **digit**, only **letters and numbers**, and **7 or more** characters total.”

---

```js
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/;

console.log(regex.test("Abc1234")); //  true
console.log(regex.test("abc1234")); //  no uppercase
console.log(regex.test("ABC1234")); //  no lowercase
console.log(regex.test("Ab123"));   //  too short
console.log(regex.test("Abc123!")); //  special character not allowed
```

---


