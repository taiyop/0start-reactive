// export const h = function(tag, props, children) {
//   return {
//     tag,
//     props,
//     children
//   }
// }

import { setCurrentVnode, getCurrentVnode } from "./vnode";
export const createAppAPI = function(render) {
  return function createApp(config) {

    return {
      render: render,
      mount: function(elName) {
        let vueEl = document.getElementById(elName);
        setCurrentVnode(render());
        /*
         * このタイミングでstate.countなどがgetされて、
         * subscribersに登録、setしたときに実行される
         */
        mountChildren(getCurrentVnode(), vueEl);
      }
    }
  }
}

export const mountChildren = function(vnode, el) {
  vnode.el = document.createElement(vnode.tag);
  for (const key in vnode.props) {
    vnode.el.setAttribute(key, vnode.props[key]);
  };
  if (typeof vnode.children === 'string') {
    vnode.el.textContent = vnode.children
  } else {
    vnode.children.forEach(child => {
      mountChildren(child, vnode.el) // Recursively mount the children
    })
  }

  el.appendChild(vnode.el);
}

export const unmount = function(vnode) {
  vnode.el.parentNode.removeChild(vnode.el);
}
