import { useActionState } from "react";
import ServerAction from "./ServerAction";

export default function App() {

  const [message, formAction, isPending] = useActionState(ServerAction, null)
  console.log('tell me the message ', message);
  return (
    <div className="container mx-auto max-w-xl mt-4 px-4">
      <h1 className="text-center text-3xl font-bold mb-6">
      Validation in React using useActionState
      </h1>

      <div className="border-2 p-6 rounded-lg space-y-4">
      
        <form action={formAction} className="space-y-4">
          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="username"
              //defaultValue={data?.name}
              placeholder="Enter username"
            />
          </div>

          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="password"
             // defaultValue={data?.password}
              placeholder="Enter password"
            />
          </div>

         {/*  {data?.message && (
            <p className="text-green-600 text-sm">{data.message}</p>
          )}
          {data?.error && <p className="text-red-600 text-sm">{data.error}</p>}
 */}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Login
           {/* // {pending ? "Logging in..." : "Login"} */}
          </button>
        </form>
        {(isPending || message ) && (
          <p >{isPending ? "Loading..." : message} </p>
        )}
      </div>
    </div>
  );
}
