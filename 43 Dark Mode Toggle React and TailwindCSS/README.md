# Toggle Dark Light Mode in React 19 using TailwindCSS

- Create a Context (ThemeContext) to store current theme and function to toggle it.

- Create a Provider Component (ThemeProvider) that Wraps its children with ThemeContext.Provider.

Inside ThemeProvider, use the useState hook to manage the theme initialized to "light"

Define a toggleTheme function that switches theme between "light" and "dark" mode.