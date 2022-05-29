import { extendObservable, observable, remove, runInAction, isObservable } from 'mobx';
import { useRef } from 'react';

export function useAsLocalSource<T extends object>(data: T): T {

    const initStateCallback = () => {
        if (Array.isArray(data)) {
            throw new Error('Arrays is unsupported!');
        }
        const initState = observable({}, undefined, { deep: false }) as T;
        return initState;
    };

    const state = useRef(initStateCallback()).current;

    runInAction(() => {
        for (const key in state) {
            if (!Object.keys(data).includes(key)) {
                remove(state, key);
            }
        }
        for (const key in data) {
            if (isObservable(data[key])) {
                state[key] = data[key];
            } else {
                if(data[key] !== state[key]){
                    remove(state, key);
                    extendObservable(state, { [key]: data[key] }, { [key]: false })
                }
            }
        }
    })

    return state;
};