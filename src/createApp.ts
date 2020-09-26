// export const h = function(tag, props, children) {
//   return {
//     tag,
//     props,
//     children
//   }
// }

export const mount = function(vnode, el) {
  vnode.el = document.createElement(vnode.tag);
  for (const key in vnode.props) {
    vnode.el.setAttribute(key, vnode.props[key]);
  };
  if (typeof vnode.children === 'string') {
    vnode.el.textContent = vnode.children
  } else {
    vnode.children.forEach(child => {
      mount(child, vnode.el) // Recursively mount the children
    })
  }

  el.appendChild(vnode.el);
}

export const unmount = function(vnode) {
  vnode.el.parentNode.removeChild(vnode.el);
}
