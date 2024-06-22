import { remove, runInAction, makeAutoObservable, extendObservable, isObservable } from 'mobx';
import { useRef, useState } from 'react';

export function useMobxState<T extends Record<any, any>>(state: T | (() => T)): T;
export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props: P): T & P;

export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props?: P): T & P {
  const initStateFunction = typeof state === "function" ? (state as any) : () => state;
  const mobxState = useState(() => makeAutoObservable(initStateFunction()))[0] as Record<string, any>;

  const keyListOfState = useRef<string[]>([]);

  runInAction(() => {

    if (props) {

      for (const key of keyListOfState.current) {
        if (!Object.keys(props).includes(key)) {
          remove(mobxState, key);
        }
      }

      for (const key of Object.keys(props)) {
        for (const key in props) {
          if (isObservable(props[key]) || Object.getOwnPropertyDescriptor(props, key)?.get) {
            Object.defineProperty(mobxState, key, Object.getOwnPropertyDescriptor(props, key) as any);
          } else {
            if (props[key] !== mobxState[key]) {
              remove(mobxState, key);
              extendObservable(mobxState, { [key]: props[key] }, { [key]: false });
            }
          }
        }
      }

      keyListOfState.current.splice(0, keyListOfState.current.length);
      for (const key of Object.keys(props)) {
        keyListOfState.current.push(key);
      }
    }
  })

  return mobxState as any;
}
