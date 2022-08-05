declare function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T, props?: P): T & P;
declare function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(statefn: () => T, propsfn: () => P): T & P;
declare function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(statefn: () => T, props?: P): T & P;
declare function useMobxState<T extends Record<any, any>, P extends Record<any, any>>(state: T, propsfn: () => P): T & P;

export { useMobxState };
