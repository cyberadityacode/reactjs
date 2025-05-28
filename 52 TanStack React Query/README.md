# TanStack Query [React Query]

## QueryClientProvider

Provides QueryClient Instance to yout react application. This is responsible for managing all the data fetching, catching, and state management related to your queries.

QueryClient- Its a core part of the react-query library. It manages the caching, background fetching, data sychronization and other query related logic. 

It provides a centralized store for managing and caching asynchronous data in your application.

Think of QueryClient as:
The boss that knows about all the API data in your app — it manages fetching, caching, updating, and syncing of server state.


Basic Responsibilities:
Caching your fetched data.

Tracking loading and error states for each query.

Refetching data when needed (e.g., on window focus or network reconnect).

Managing background updates.

Handling query invalidation, refetch intervals, etc.

QueryClient is the core engine behind React Query — it handles everything related to managing server data in your React app.
