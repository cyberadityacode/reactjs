# TanStack React Query - Pagination

```jsx
placeholderData: keepPreviousData, 
```
"keep my previous data safe, append whats new because i don't like loading message"

## Upper Boundary Limit Concept gist
```jsx
disabled={!data || data.length < pageSize}
```

"Turn off the Next button if we don’t have any data yet, or if we got less than a full page of results — because that means there’s nothing left to show."