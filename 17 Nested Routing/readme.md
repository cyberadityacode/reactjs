# Routing in a React App using React Router with Parcel and Tailwind CSS Integration

## BrowserRouter 

> BrowserRouter is a React Router component that uses the HTML5 History API to manage navigation without page reloads. It enables clean URLs and syncs the UI with the browser's address bar in single-page applications.

## Routes

> Routes is a wrapper that looks through all the Route components and shows the one that matches the URL. It helps display the right page based on the path.

## Route

> Route is used to define a path and the component that should show when the URL matches that path. It helps connect URLs to specific pages in your app. 


## 3 key differences between `Link` and `NavLink`:

* **Active Styling**: `NavLink` adds an `active` class when the link matches the current URL; `Link` does not.
* **Styling Control**: `NavLink` supports dynamic `className` or `style` based on active state; `Link` uses static styles.
* **Purpose**: `Link` is for basic navigation, while `NavLink` is ideal for menus or tabs where highlighting the active link is useful.


## Page Not Found Redirection to 404 custom Page
```jsx
<Route path="/*" element={ <PageNotFound />}
```

## Page Not Found Redirection to Home Page

```jsx
<Route path="/*" element={<Navigate to="/" />} />
```
make sure to place as a last routing measure.

# What is Outlet?

* <Outlet /> In React, Router is a placeholder used to render child routes inside a parent route's component.
* It allows nested routing where the parent provides layout (e.g., header/sidebar) and the child fills the content.
* Use it when defining nested <Route> structures to display child components dynamically.