import { useMount } from './useMount';
import { ReplaySubject, Subscription, tap } from 'rxjs';
import { observable, reaction, toJS } from 'mobx'
import { useEffect, useRef } from 'react';
import { extendObservable, remove, isObservable, runInAction } from 'mobx';

export const useMobxEffect = (callback: () => void, dependencyList?: any[]): void => {

  const callbackRef = useRef<{ callback: () => void }>({ callback: callback });

  const subjectRef = useRef(new ReplaySubject<void>(1));

  const dependencyListRef = useRef(dependencyList);

  callbackRef.current!.callback = callback;

  dependencyListRef.current = dependencyList;

  useEffect(() => {
    if (dependencyList) {
      return;
    }
    callback();
  })

  useEffect(() => {
    if (!dependencyList) {
      return;
    }
    subjectRef.current.next();
  }, dependencyList)

  useMount((subscription) => {
    if (!dependencyList) {
      return;
    }
    const mobxData = observable(Object.assign({}, dependencyListRef.current));
    subscription.add(subjectRef.current.pipe(
      tap(() => {
        runInAction(() => {
          const props = Object.assign({}, dependencyListRef.current);
          for (const key in props) {
            if (isObservable(props[key]) || Object.getOwnPropertyDescriptor(props, key)?.get) {
              Object.defineProperty(mobxData, key, Object.getOwnPropertyDescriptor(props, key) as any);
            } else {
              if (props[key] !== mobxData[key]) {
                remove(mobxData, key);
                extendObservable(mobxData, { [key]: props[key] }, { [key]: false });
              }
            }
          }
        })
      })
    ).subscribe());

    const disposer = reaction(() => [toJS(mobxData)], () => callbackRef.current!.callback(), { fireImmediately: true, delay: 1 });

    subscription.add(new Subscription(() => {
      disposer();
    }));

  })

}