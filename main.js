var childNode = {
  tag: 'div',
  props: {
    class: 'title'
  },
  children: 'hello world'
};

var vnode = {
  tag: 'div',
  props: {
    class: 'container'
  },
  children: [childNode]
};

var vueEl = document.getElementById('app');

mount(vnode, vueEl);

function mount(vnode, el) {
  var vnodeEl = document.createElement(vnode.tag);
  for (const key in vnode.props) {
    vnodeEl.setAttribute(key, vnode.props[key]);
  };
  if (typeof vnode.children === 'string') {
    vnodeEl.textContent = vnode.children
  } else {
    vnode.children.forEach(child => {
      mount(child, vnodeEl) // Recursively mount the children
    })
  }

  el.appendChild(vnodeEl);
}
