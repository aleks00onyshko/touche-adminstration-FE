import { SimpleChange } from '@angular/core';

type MarkFunctionProperties<Component> = {
  [Key in keyof Component]: Component[Key] extends Function ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

export declare class SimpleChangeGeneric<T = any> extends SimpleChange {
  public previousValue: T;
  public currentValue: T;
  public firstChange: boolean;
  constructor(previousValue: T, currentValue: T, firstChange: boolean);
  public isFirstChange(): boolean;
}

// not perfect as it still allows public properties without @Input()
// but far better than non existing code completion on 'any' type
export type SimpleChangesGeneric<Component = any, Props = ExcludeFunctions<Component>> = {
  [P in keyof Props]: SimpleChangeGeneric<Props[P]>;
};
