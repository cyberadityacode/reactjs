import { useQuery } from "@tanstack/react-query";
import { fetchLiveData } from "../API/axiosAPI";

export default function LiveRQ() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchLiveData,
    staleTime:0,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

  return (
    <div>
      <h1>Live RQ</h1>
      <h1 className="text-2xl">{data?.currentLocalTime}</h1>
    </div>
  );
}
