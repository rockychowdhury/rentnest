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
  // NOTE: initial state must be constant. The server prerender always bakes
  // the loading skeleton (module cache is empty server-side since effects
  // never run there). Reading the warm module cache in useState would render
  // the loaded buttons on the client's first render -> hydration mismatch.
  // Cache is consumed inside the effect instead, so server HTML and the
  // first client render always agree.
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const applyUser = (user: User | null) => {
      if (cancelled) return;
      setRole(user?.role || null);
      setLoading(false);
    };

    if (cachedUser !== undefined) {
      // Warm cache: resolve through a subscription, not a sync setState.
      Promise.resolve(cachedUser).then(applyUser);
      return () => {
        cancelled = true;
      };
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

    fetchPromise.then(applyUser);
    return () => {
      cancelled = true;
    };
  }, []);

  return { role, loading };
}
