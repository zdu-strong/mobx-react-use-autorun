import { extendObservable, remove, isObservable, runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useRef } from 'react';

export function useMobxState<T extends Record<any, any>>(state: T | (() => T)): T;
export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props: P): T & P;

export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props?: P): T & P {
    const mobxState = useLocalObservable(typeof state === "function" ? (state as any) : () => state);

    const keyListOfState = useRef<string[]>([]);

    runInAction(() => {

        if (props) {

            for (const key of keyListOfState.current) {
                if (!Object.keys(props).includes(key)) {
                    remove(mobxState, key);
                }
            }

            for (const key in props) {
                if (isObservable(props[key]) || Object.getOwnPropertyDescriptor(props, key)?.get) {
                    Object.defineProperty(mobxState, key, Object.getOwnPropertyDescriptor(props, key) as any)
                } else {
                    if (props[key] !== mobxState[key]) {
                        remove(mobxState, key);
                        extendObservable(mobxState, { [key]: props[key] }, { [key]: false })
                    }
                }
            }

            keyListOfState.current.splice(0, keyListOfState.current.length);
            for (const key in props) {
                keyListOfState.current.push(key);
            }
        }
    })

    return mobxState as any;
}
