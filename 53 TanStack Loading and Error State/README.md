# TanStack React Query - Loading and Errors

# staleTime in react query

In React Query, staleTime is a configuration option that determines how long fetched data is considered fresh before it needs to be refetched.

**Fresh Data** - When data is initially fetched or updated, its considered fresh.

**Stale Data** - After the staleTime duration (specified in milliseconds) elapses, the data is considered Stale.

**Default Value** - The Default stale time is 0, meaning that the data becomes stale immediately after being fetched.
This ensures data is always up to date but can lead to frequent refetching.