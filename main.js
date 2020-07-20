var vnode = {
  tag: 'div',
  props: {
    class: 'container'
  },
  children: 'hello world'
};

var vueEl = document.getElementById('app');

console.log(vueEl);

var el = document.createElement(vnode.tag);
for (const key in vnode.props) {
  el.setAttribute(key, vnode.props[key]);
};
el.textContent = vnode.children;

vueEl.appendChild(el);

console.log('loading');
