# TanStack React Query - useMutation

Hook is used for Create, Update, Delete.
Since, Read operation is done via useQuery hook in Tanstack.

Even after Deleting the data from an api, you need to remove it from your local cache.  

create a const variable 
const queryClient = useQueryClient();

queryClient.setQueryData is used to update the cached data for a specific query. In this case, it's the query with the key["post", pageNumber], which likely represents the list of posts on the current page.

Once the deletion is done from an API and the local cache, your pagination existing logic will crumble, because Its working on the precondition of pageSize.

---

The issue is this part:

```jsx
<button
  disabled={!data || data.length < pageSize}
  data-type="next"
  onClick={handlePaginationClick}
>
  Next
</button>
```

### ❌ Problem:

After you delete a post, your current page might now have **less than `pageSize` items**, which makes this condition:

```js
data.length < pageSize
```

return `true`, **disabling the Next button** — even if there **are more posts** available on the next page.

---

### ✅ Solution:

You **cannot reliably use `data.length < pageSize`** to determine if there's another page, because deletions reduce the current page length.

So instead, you can:

1. **Pre-fetch the next page's data** using `queryClient.fetchQuery` or `useQuery` with a side effect.
2. **Check if the next page has data**.
3. Use that to conditionally enable the "Next" button.

---

### 🛠 How to implement it:

#### 🔄 Step 1: Prefetch next page data

Add this `useQuery` to check if there's a next page:

```js
const {
  data: nextPageData
} = useQuery({
  queryKey: ["posts", pageNumber + pageSize],
  queryFn: () => fetchData(pageNumber + pageSize),
  enabled: !!data, // only run if current page data exists
});
```

#### ✅ Step 2: Change Next button disabling logic

Update this:

```jsx
<button
  disabled={!data || data.length < pageSize}
  data-type="next"
  onClick={handlePaginationClick}
>
  Next
</button>
```

To this:

```jsx
<button
  disabled={!nextPageData || nextPageData.length === 0}
  data-type="next"
  onClick={handlePaginationClick}
>
  Next
</button>
```

---

### ✅ Final Fix Summary

Your component should have this extra query and updated button:

```js
// Check if next page has data
const { data: nextPageData } = useQuery({
  queryKey: ["posts", pageNumber + pageSize],
  queryFn: () => fetchData(pageNumber + pageSize),
  enabled: !!data,
  placeholderData: [],
});
```

And:

```jsx
<button
  disabled={!nextPageData || nextPageData.length === 0}
  data-type="next"
  onClick={handlePaginationClick}
>
  Next
</button>
```

---

### 📌 Bonus (Optional Prefetch Optimization)

If you want a smoother user experience, you can **prefetch** the next page like this:

```js
useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["posts", pageNumber + pageSize],
    queryFn: () => fetchData(pageNumber + pageSize),
  });
}, [pageNumber, queryClient]);
```


---

Great question! Let’s break down this line by line:

---

### 👇 Code:

```js
const { data: nextPageData } = useQuery({
  queryKey: ["posts", pageNumber + pageSize],
  queryFn: () => fetchData(pageNumber + pageSize),
  enabled: !!data,
  placeholderData: [],
});
```

---

### 💡 What is it doing?

This `useQuery` is **checking if a next page exists** by preloading the data for the next page. Its purpose is **not to render the data**, but to determine whether to enable/disable the **"Next"** button.

---

### ✅ Line-by-line Explanation:

#### `const { data: nextPageData }`

* We’re using object destructuring with **aliasing**.
* `data: nextPageData` means “give me the `data` from `useQuery` and name it `nextPageData`”.
* We use `nextPageData` to check if the next page has any posts.

#### `useQuery({...})`

* React Query hook to fetch & cache the data for the **next page**.

---

#### `queryKey: ["posts", pageNumber + pageSize]`

* The cache key is `["posts", nextPageNumber]`.
* If `pageNumber = 0`, then this becomes `["posts", 3]`, meaning we are fetching posts starting from index 3.

---

#### `queryFn: () => fetchData(pageNumber + pageSize)`

* Calls your `fetchData` function with the **next page offset**.
* If each page is 3 items and current page is 0, the next page will start at 3.

---

#### `enabled: !!data`

* This ensures that the query for the **next page** only runs **after the current page data is available**.
* `!!data` is a double-bang that converts a value to `true` or `false`.

---

#### `placeholderData: []`

* While loading the next page, we don't want a loading spinner — just return an empty array until actual data arrives.
* Keeps the UI clean.

---

### 🎯 Why is this useful?

This setup lets you do:

```js
<button disabled={!nextPageData || nextPageData.length === 0}>Next</button>
```

It prevents the user from clicking “Next” when there’s no more data available (i.e., no more posts in the next page).

---

### ✅ Summary:

This extra `useQuery`:

* Pre-fetches the next page.
* Helps **disable "Next"** if there's no more data.
* Keeps UI smooth without unnecessary loaders.

Let me know if you want to turn this into a **custom hook** like `usePagination()`.


---

# Final Explaination of Entire Code

Absolutely! Let’s break this code down with **real-life metaphors** to make it simple and fun to understand. 🎭

---

## 📦 What are we building?

A **paginated post viewer** where:

* Each page shows **3 posts**.
* You can **delete a post**.
* After deletion, the app **smartly fills the gap** or **goes to the previous page** if needed.
* Uses **React Query** to fetch, cache, and manage data smoothly.

---

## 🏡 Metaphor: The Library Bookshelf 📚

Imagine a **digital bookshelf** in a library:

* Each **shelf** is a page.
* Each **book** is a post.
* You can go to the **next** or **previous shelf**.
* If someone **removes a book** from a shelf, you try to **borrow one from the next shelf** to keep the shelf full.
* If a shelf becomes **completely empty**, you **go back to the previous one**.

---

### ✅ Breakdown of the Code

---

### 🔧 Imports

```js
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
```

🛠️ Tools from React Query for:

* `useQuery`: fetch data.
* `useMutation`: delete data.
* `useQueryClient`: access/update the cache.
* `keepPreviousData`: helps keep old data visible while loading new one (to avoid flickering).

---

### 📦 Basic Setup

```js
const pageSize = 3;
const [pageNumber, setPageNumber] = useState(0);
const queryClient = useQueryClient();
```

👆 You’re saying:

> "Each shelf holds 3 books. I’m starting from shelf 0. I’ve got access to the full library (queryClient)."

---

### 📬 Fetch Current Shelf (Page)

```js
const { data, isPending, isError, error } = useQuery({
  queryKey: ["posts", pageNumber],
  queryFn: () => fetchData(pageNumber),
  placeholderData: keepPreviousData,
});
```

📖 You say:

> “Hey, library! Give me books on shelf number `pageNumber`. If I’m waiting, show the last shelf’s books for now.”

---

### 👀 Check Next Shelf (Prefetch)

```js
const { data: nextPageData } = useQuery({
  queryKey: ["posts", pageNumber + pageSize],
  queryFn: () => fetchData(pageNumber + pageSize),
  enabled: !!data,
  placeholderData: [],
});
```

👁️ You peek:

> “Let me quietly check if the next shelf even has books, so I can know if ‘Next’ should be allowed.”

---

### 🎩 Background Prefetch (Smooth UX)

```js
useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["posts", pageNumber + pageSize],
    queryFn: () => fetchData(pageNumber + pageSize),
  });
}, [pageNumber, queryClient]);
```

💡 You whisper to the library:

> “While I’m looking at shelf `n`, get shelf `n+1` ready in the back — just in case I go there next.”

---

### 🗑️ Delete Post Logic (Mutation)

```js
const deleteMutation = useMutation({
  mutationFn: (id) => deletePost(id),
  onSuccess: (data, id) => {
    // Remove the deleted book
    // Try topping up the shelf from next shelf
    // If shelf is now empty, go back
  },
});
```

Let’s break the **onSuccess** part:

#### 📤 1. Remove the Deleted Book

```js
const filteredData = oldData.filter((post) => post.id !== id);
```

> “Remove this specific book from the shelf.”

---

#### 🔁 2. Try Topping Up from Next Shelf

```js
const nextPage = queryClient.getQueryData(["posts", pageNumber + pageSize]) || [];
const needed = pageSize - filteredData.length;
const topUp = nextPage.slice(0, needed);
```

> “Hey! This shelf now has only 2 books. Borrow 1 from the next shelf to keep this shelf looking full.”

---

#### 🧹 3. Clean the Next Shelf

```js
queryClient.setQueryData(["posts", pageNumber + pageSize], (nextOld) =>
  nextOld ? nextOld.slice(needed) : []
);
```

> “Since I borrowed 1 book from next shelf, update that shelf so it doesn’t show the same book again.”

---

#### 🔄 4. If Shelf is Empty, Go Back

```js
if(updatedPageData.length === 0 && pageNumber > 0){
  setPageNumber((prev)=> Math.max(0, prev - pageSize));
}
```

> “Oops! This shelf became completely empty. Go back to the previous one.”

---

### 🧠 Delete Button Click

```js
const handleDeletePost = (e) => {
  const deleteId = Number(e.target.dataset.id);
  deleteMutation.mutate(deleteId);
};
```

> “When user clicks delete, start the deletion mutation.”

---

### ⬅️➡️ Pagination Click

```js
const handlePaginationClick = (e) => {
  const btnType = e.target.dataset.type;
  btnType === "next"
    ? setPageNumber((prev) => prev + pageSize)
    : setPageNumber((prev) => Math.max(0, prev - 3));
};
```

> “Go to next or previous shelf, depending on the button clicked.”

---

### 🖼️ Rendering UI

```js
<ul>
  {data?.map((currentData) => {
    return (
      <li key={currentData.id}>
        <NavLink to={`/rq/${currentData.id}`}>
          <p>Id: {currentData.id}</p>
          <p>Title: {currentData.title}</p>
        </NavLink>
        <button data-id={currentData.id} onClick={handleDeletePost}>
          Delete Post
        </button>
      </li>
    );
  })}
</ul>
```

📜 Show all books on the current shelf with delete options.

---

### 🔘 Pagination Buttons

```js
<button
  disabled={pageNumber <= 0}
  data-type="prev"
  onClick={handlePaginationClick}
>
  Prev
</button>
<h2>{pageNumber / pageSize + 1}</h2>
<button
  disabled={!nextPageData || nextPageData.length === 0}
  data-type="next"
  onClick={handlePaginationClick}
>
  Next
</button>
```

> Disable `Prev` when you're at the first shelf.
> Disable `Next` if the next shelf has no books.

---

## 🎉 Summary

| Feature               | Real-life Analogy 🧠                           |
| --------------------- | ---------------------------------------------- |
| `useQuery`            | Ask the librarian for a shelf of books         |
| `placeholderData`     | Show last shelf while waiting for new one      |
| `useMutation`         | Remove a book from a shelf                     |
| Top-up from next page | Borrow books from next shelf to fill gaps      |
| Navigate to previous  | Move to earlier shelf if current becomes empty |
| Prefetching           | Peek at the next shelf in advance              |

---


