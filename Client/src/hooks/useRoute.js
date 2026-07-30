import { useEffect, useState } from "react";

const getInitialRoute = () => {
  if (typeof window === "undefined") {
    return "/";
  }
  return window.location.pathname || "/";
};

// Minimal client-side router: just enough to distinguish "/" from
// "/admin/dashboard" and keep the browser back/forward buttons working.
export const useRoute = () => {
  const [route, setRoute] = useState(getInitialRoute);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handlePopState = () => setRoute(window.location.pathname || "/");

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (nextRoute) => {
    const safeRoute = nextRoute || "/";

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", safeRoute);
    }

    setRoute(safeRoute);
  };

  return { route, navigateTo };
};
