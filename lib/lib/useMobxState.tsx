import { extendObservable, remove, isObservable, runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';

export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props?: P): T & P {
    const mobxState = useLocalObservable(typeof state === "function" ? (state as any) : () => state);

    runInAction(() => {

        if (props) {
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
        }
    })

    return mobxState as any;
}