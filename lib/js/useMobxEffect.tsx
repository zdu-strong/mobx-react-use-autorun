import { useMount } from './useMount';
import { Subscription } from 'rxjs';
import { reaction, toJS } from 'mobx'
import { useMobxState } from './useMobxState';
import { useEffect } from 'react';

export const useMobxEffect = (callback: () => void, dependencyList?: any[]): void => {

  const state = useMobxState({
  }, { callback })

  const source = useMobxState({}, Object.assign({}, dependencyList));

  useEffect(() => {
    if (!dependencyList) {
      callback()
    }
  })

  useMount((subscription) => {
    if (dependencyList) {
      const disposer = reaction(() => [toJS(source)], () => state.callback(), { fireImmediately: true, delay: 1 });

      subscription.add(new Subscription(() => {
        disposer();
      }));
    }
  })

}