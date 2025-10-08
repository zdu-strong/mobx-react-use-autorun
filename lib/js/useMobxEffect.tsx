import { useMount } from './useMount';
import { reaction, toJS } from 'mobx'
import { useEffect } from 'react';
import { useMobxState } from './useMobxState';

export const useMobxEffect = (callback: () => void, dependencyList?: any[]): void => {

    const state = useMobxState({
    }, {
        callback
    });

    const dependencyListState = useMobxState({

    }, {
        ...(dependencyList ? dependencyList : {})
    })

    useEffect(() => {
        if (dependencyList) {
            return;
        }
        callback();
    })

    useMount((subscription) => {
        if (!dependencyList) {
            return;
        }

        const disposer = reaction(() => [toJS(dependencyListState)], () => state.callback(), { fireImmediately: true, delay: 1 });

        subscription.add(() => disposer());
    })

}