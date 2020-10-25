let subscribers = new Set()

let activeEffect = null

export const watchEffect = (effect) => {
  activeEffect = effect
  effect()
  activeEffect = null
}

export function reactive(state) {
  Object.keys(state).forEach((key) => {
    let value = state[key];
    Object.defineProperty(state, key, {
      get() {
        if(activeEffect) {
          subscribers.add(activeEffect)
        }
        return value
      },
      set(newValue) {
        if(newValue !== value){
          value = newValue
          subscribers.forEach((sub: any) => sub())
        }
      }
    });
  });
}
