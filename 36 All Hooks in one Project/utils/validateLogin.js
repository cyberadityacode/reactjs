export function validateLogin(name, value) {
  let error = "";

  if (name === "username") {
    if (!value.trim()) {
      error = "Username is required";
    }
  }

  if (name === "password") {
    if (!value) {
      error = "Password is required";
    } else if (value.length < 7) {
      error = "Password must be at least a thala"; // 😄 CSK fan detected!
    }
  }

  return { [name]: error };
}
