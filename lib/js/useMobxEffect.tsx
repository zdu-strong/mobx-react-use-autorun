import { useMount } from './useMount';
import { Subscription } from 'rxjs';
import { observable, reaction, toJS } from 'mobx'
import { useEffect, useRef } from 'react';
import { extendObservable, remove, isObservable, runInAction } from 'mobx';

export const useMobxEffect = (callback: () => void, dependencyList?: any[]): void => {

  const callbackRef = useRef<{ callback: () => void }>({ callback: callback });

  callbackRef.current!.callback = callback;

  const keyListOfSourceRef = useRef<string[]>([]);

  const props = Object.assign({}, dependencyList);

  const sourceRef = useRef(observable({
    ...props
  }));

  runInAction(() => {
    if (dependencyList) {

      for (const key of keyListOfSourceRef.current) {
        if (!Object.keys(props).includes(key)) {
          remove(sourceRef.current!, key);
        }
      }

      for (const key in props) {
        if (isObservable(props[key]) || Object.getOwnPropertyDescriptor(props, key)?.get) {
          Object.defineProperty(sourceRef.current!, key, Object.getOwnPropertyDescriptor(props, key) as any)
        } else {
          if (props[key] !== sourceRef.current![key]) {
            remove(sourceRef.current!, key);
            extendObservable(sourceRef.current!, { [key]: props[key] }, { [key]: false })
          }
        }
      }

      keyListOfSourceRef.current.splice(0, keyListOfSourceRef.current.length);
      for (const key in props) {
        keyListOfSourceRef.current.push(key);
      }
    }
  })

  useEffect(() => {
    if (!dependencyList) {
      callback()
    }
  })

  useMount((subscription) => {
    if (dependencyList) {
      const disposer = reaction(() => [toJS(sourceRef.current)], () => callbackRef.current!.callback(), { fireImmediately: true, delay: 1 });

      subscription.add(new Subscription(() => {
        disposer();
      }));
    }
  })

}