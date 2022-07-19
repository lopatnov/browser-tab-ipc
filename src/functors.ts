export type Action = () => void;
export type Action1<TParam> = (param: TParam) => void;
export type Action2<TParam1, TParam2> = (param1: TParam1, param2: TParam2) => void;
export type Action3<TParam1, TParam2, TParam3> = (param1: TParam1, param2: TParam2, param3: TParam3) => void;
export type Action4<TParam1, TParam2, TParam3, TParam4> = (param1: TParam1, param2: TParam2, param3: TParam3, param4: TParam4) => void;
export type Action5<TParam1, TParam2, TParam3, TParam4, TParam5> = (
  param1: TParam1,
  param2: TParam2,
  param3: TParam3,
  param4: TParam4,
  param5: TParam5,
) => void;
export type Func<TResult> = () => TResult;
export type Func1<TParam, TResult> = (param: TParam) => TResult;
export type Func2<TParam1, TParam2, TResult> = (param1: TParam1, param2: TParam2) => TResult;
export type Func3<TParam1, TParam2, TParam3, TResult> = (param1: TParam1, param2: TParam2, param3: TParam3) => TResult;
export type Func4<TParam1, TParam2, TParam3, TParam4, TResult> = (param1: TParam1, param2: TParam2, param3: TParam3, param4: TParam4) => TResult;
export type Func5<TParam1, TParam2, TParam3, TParam4, TParam5, TResult> = (
  param1: TParam1,
  param2: TParam2,
  param3: TParam3,
  param4: TParam4,
  param5: TParam5,
) => TResult;
