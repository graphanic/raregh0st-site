import { useEffect } from "react";
import { loadApolloTracker } from "../lib/apolloTracker";

export const ApolloTracker = ({ enabled }) => {
  useEffect(() => {
    if (enabled) loadApolloTracker();
  }, [enabled]);

  return null;
};
