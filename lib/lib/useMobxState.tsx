import { extendObservable, remove, isObservable } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';

export function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T, props?: P): T & P {

    const mobxState = useLocalObservable(() => state);

    for (const key in props) {
        if (isObservable(props[key])) {
            mobxState[key] = props[key];
        } else {
            if (props[key] !== mobxState[key]) {
                remove(mobxState, key);
                extendObservable(mobxState, { [key]: props[key] }, { [key]: false })
            }
        }
    }

    return mobxState;
}