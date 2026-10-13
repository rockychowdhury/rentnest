import { useState, useEffect } from "react";
import { getMe } from "@/service/getMe";
import { User } from "@/types";

let cachedUser: User | null | undefined = undefined;
let fetchPromise: Promise<User | null> | null = null;

// Clear the cache after a short time so client-side navigation can refetch
const clearCacheTimer = () => {
  setTimeout(() => {
    cachedUser = undefined;
    fetchPromise = null;
  }, 2000);
};

export function useUserRole() {
  const [role, setRole] = useState<string | null>(
    cachedUser ? cachedUser.role : null
  );
  const [loading, setLoading] = useState<boolean>(cachedUser === undefined);

  useEffect(() => {
    if (cachedUser !== undefined) {
      setRole(cachedUser?.role || null);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getMe().then((res) => {
        const user = res?.success ? res.data : null;
        cachedUser = user;
        clearCacheTimer();
        return user;
      }).catch(() => {
        cachedUser = null;
        clearCacheTimer();
        return null;
      });
    }

    fetchPromise.then((user) => {
      setRole(user?.role || null);
      setLoading(false);
    });
  }, []);

  return { role, loading };
}
