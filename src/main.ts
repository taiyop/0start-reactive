import { patch } from './renderer'
import { createAppAPI } from './createApp'
import { compile } from './compiler'
import { setCurrentVnode, getCurrentVnode } from "./vnode";
import { reactive, watchEffect } from './reactive'


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


// let vueEl = document.getElementById('app');
// setCurrentVnode(newRender());
/*
 * このタイミングでstate.countなどがgetされて、
 * subscribersに登録、setしたときに実行される
 */
let createApp =  createAppAPI(newRender)
createApp({}).mount('app');

// reactive登録
reactive(state);
// 更新処理
const action = () => {
  let newVnode = newRender();

  patch(getCurrentVnode(), newVnode);
  setCurrentVnode(newVnode);
}

watchEffect(action)

