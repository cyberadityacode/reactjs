import { NavLink, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  // useRouteError Hook

  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <h1>
        ErrorPage {error.data} Status- {error.status}
      </h1>

      <NavLink to="/">
        <button>Go Home</button>
      </NavLink>
    </div>
  );
}
