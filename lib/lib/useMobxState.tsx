import { extendObservable, remove, isObservable, keys } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';

export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T | (() => T), props?: P | (() => P)): T & P {
    const mobxState = useLocalObservable(typeof state === "function" ? (state as any) : () => state);

    const propsResult = typeof props === "function" ? (props as any)() : props;

    if (propsResult) {
        for (const key in propsResult) {
            if (isObservable(propsResult[key])) {
                mobxState[key] = propsResult[key];
            } else {
                if (propsResult[key] !== mobxState[key]) {
                    if(keys(mobxState).includes(key)){
                        remove(mobxState, key);
                    }
                    extendObservable(mobxState, { [key]: propsResult[key] }, { [key]: false })
                }
            }
        }
    }

    return mobxState as any;
}