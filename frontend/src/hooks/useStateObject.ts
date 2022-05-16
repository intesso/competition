import { useState } from 'react'

export type PartOf<Type> = {
  [Property in keyof Type]?: Type[Property]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStateObject<T> (initialState: T) {
  const [state, overrideState] = useState(initialState)
  const mutateState = (newState: PartOf<T>) => {
    for (const key in newState) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state[key] = newState[key]!
    }
  }
  const setState = (newState: PartOf<T>) => {
    mutateState(newState)
    overrideState({ ...state, ...newState })
  }
  return [state, setState] as [typeof state, typeof setState]
}
