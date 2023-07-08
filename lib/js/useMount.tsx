import { useEffect } from "react";
import { Subscription } from "rxjs";
import { useMobxState } from "./useMobxState";

export function useMount(callback: (subscription: Subscription) => void) {

  const state = useMobxState({
    subscription: new Subscription(),
  });

  useEffect(() => {
    const subscription = new Subscription();
    state.subscription = subscription;
    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    const subscription = new Subscription();
    state.subscription.add(subscription);
    callback(subscription);
    return () => subscription.unsubscribe();
  }, [])

}