// hooks/useUserStatus.js
import { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { onValue, ref } from "firebase/database";


const useUserStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const statusRef = ref(rtdb, `status/${userId}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setIsOnline(data?.state === "online");
    });

    return () => unsubscribe();
  }, [userId]);

  return isOnline;
};

export default useUserStatus;
