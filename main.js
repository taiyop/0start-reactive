var vnode = {
  tag: 'div',
  props: {
    class: 'container'
  },
  children: 'hello world'
};

var vueEl = document.getElementById('app');

mount(vnode, vueEl);

function mount(vnode, el) {
  var vnodeEl = document.createElement(vnode.tag);
  for (const key in vnode.props) {
    vnodeEl.setAttribute(key, vnode.props[key]);
  };
  vnodeEl.textContent = vnode.children;

  el.appendChild(vnodeEl);
}
