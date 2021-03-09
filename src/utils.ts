export const asyncWrap = <T, E = Error>(promise: Promise<T>) =>
  new Promise<[E, T]>((resolve) =>
    promise.then((data: T) => resolve([null, data])).catch((err: E) => resolve([err, null])),
  )
