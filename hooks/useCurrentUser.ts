"use client";

import { useState, useEffect } from "react";
import { getMe } from "@/service/getMe";
import type { User } from "@/types";

let cachedUser: User | null | undefined = undefined;
let fetchPromise: Promise<User | null> | null = null;

/**
 * Client-side current-user reader for static dashboard shells.
 * Dashboard layouts are fully static (no server user fetch) so the sidebar
 * never suspends or refetches on navigation. Identity blocks read through
 * this hook: deterministic `loading` first render (avoids hydration
 * mismatch), then the cached user. The module cache lives for the session —
 * logout performs a hard redirect which resets it.
 */
export function useCurrentUser(initialUser?: User | null) {
  // Deterministic initial state: server prerender and first client render
  // must agree (both loading) — never read the warm cache in useState.
  const [user, setUser] = useState<User | null | undefined>(initialUser);
  const [loading, setLoading] = useState<boolean>(initialUser === undefined);

  useEffect(() => {
    // Resolved via prop — initializer already set the correct state.
    if (initialUser !== undefined) return;

    let cancelled = false;

    const applyUser = (u: User | null) => {
      if (cancelled) return;
      setUser(u);
      setLoading(false);
    };

    if (cachedUser !== undefined) {
      Promise.resolve(cachedUser).then(applyUser);
      return () => {
        cancelled = true;
      };
    }

    if (!fetchPromise) {
      fetchPromise = getMe()
        .then((res) => {
          const u = res?.success && res?.data ? (res.data as User) : null;
          cachedUser = u;
          return u;
        })
        .catch(() => {
          cachedUser = null;
          return null;
        });
    }

    fetchPromise.then(applyUser);
    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  return { user, loading };
}
