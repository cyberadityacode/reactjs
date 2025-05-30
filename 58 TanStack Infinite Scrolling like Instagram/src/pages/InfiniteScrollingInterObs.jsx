import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../API/dataAPI";
import { use, useEffect } from "react";
import { useInView } from "react-intersection-observer";
export default function InfiniteScrollingInterObs() {
  const { data, hasNextPage, fetchNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
      getNextPageParam: (lastPage, allPages) => {
        console.log(lastPage, allPages);
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      },
    });

  console.log(data);

  // coding with react intersection observer start
  const { ref, inView } = useInView({
    threshold: 1,
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  //coding with react intersection observer ends
  /* const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;

    if (bottom && hasNextPage) {
      fetchNextPage();
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage]); */

  if (status === "loading") return <h2>Loading...</h2>;
  if (status === "error") return <h2>Error Fetching Data</h2>;
  return (
    <div>
      <h1>Infinite Scrolling</h1>
      {data?.pages?.map((page, index) => (
        <ul key={index}>
          {page.map((user) => (
            <li
              key={user.id}
              style={{ padding: "10px", border: "1px solid #ccc" }}
            >
              <p>{user.login}</p>
              <img
                src={user.avatar_url}
                alt={user.login}
                width={50}
                height={50}
              />
            </li>
          ))}
        </ul>
      ))}
      {/* {isFetchingNextPage && <div>Loading more...</div>} */}
      <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
        {isFetchingNextPage
          ? "loading more..."
          : hasNextPage
          ? "Scroll down to load more..."
          : "No more users"}
      </div>
    </div>
  );
}
