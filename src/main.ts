import { patch } from './renderer'
import { mount } from './createApp'
import { compile } from './compiler'

let subscribers = new Set()

const state = {
  point: 1,
  name: 'taiyop'
};

const template = `
<div class="container">
  <h1 class="title">hello world</h1>
  <span>I am {{ state.name }}</span>
  <p>{{ state.name }} got {{ state.point }} point</p>
`

const renderFn = compile(template)
const newRender = new Function(renderFn)();

import { setCurrentVnode, getCurrentVnode } from "./vnode";

const action = () => {
  let newVnode = newRender();

  patch(getCurrentVnode(), newVnode);
  setCurrentVnode(newVnode);
}

function reactive(state) {
  Object.keys(state).forEach((key) => {
    let value = state[key];
    Object.defineProperty(state, key, {
      get() {
        subscribers.add(action)
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
reactive(state);

function parse(string) {
  const delimiters = ['{{', '}}'];
  string.indexOf(delimiters[1])
}


let vueEl = document.getElementById('app');

setCurrentVnode(newRender());

/*
 * このタイミングでstate.countなどがgetされて、
 * subscribersに登録、setしたときに実行される
 */
mount(getCurrentVnode(), vueEl);
