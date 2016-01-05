import { Observable } from 'rx';

// type Task x a

// succeed :: a -> Task x a
export const succeed = Observable.just;

// fail :: x -> Task x a
export const fail = Observable.throw;

// onError :: Task x a -> (x -> Task y a) -> Task y a
export function onError() {}
