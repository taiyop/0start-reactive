var childNode = {
  tag: 'h1',
  props: {
    class: 'title'
  },
  children: 'hello world'
};

var childNode2 = {
  tag: 'span',
  props: null,
  children: 'I am taiyop'
};

var childNode3 = {
  tag: 'p',
  props: null,
  children: 'Thank you for your time!'
};

var vnode = {
  tag: 'div',
  props: {
    class: 'container'
  },
  children: [childNode, childNode2]
};

var vueEl = document.getElementById('app');

mount(vnode, vueEl);

function mount(vnode, el) {
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

function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el);
}

function patch(currentNode, newNode) {
  newNode.el = currentNode.el;
  // Case that the nodes are different tag
  if(currentNode.tag != newNode.tag){
    mount(newNode, newNode.el.parentNode);
    unmount(currentNode);
  }

  // Case that the nodes are same tag
  else {
    if (typeof newNode.children == 'string') {
      newNode.el.textContent = newNode.children;
    }

    else {
      if (typeof currentNode.children == 'string') {
        newNode.el.textContent = '';
        newNode.children.forEach((child) => mount(child, newNode.el));
      }

      else {
        const commonLength = Math.min(currentNode.children.length, newNode.children.length)

        for(let i = 0; i< commonLength; i++) {
          patch(currentNode.children[i], newNode.children[i]);
        }

        if (currentNode.children.length > newNode.children.length) {
          currentNode.children.slice(newNode.children.length).forEach((child) => {
            unmount(child);
          });
        }

        else if (currentNode.children.length < newNode.children.length) {
          newNode.children.slice(currentNode.children.length).forEach((child) => {
            mount(child, newNode.el);
          });
        }
      }
    }
  }
}

var newVnode = {
  tag: 'div',
  props: {
    class: 'container'
  },
  children: [childNode, childNode2, childNode3]
};

setTimeout(() => {
  patch(vnode, newVnode);
}, 3000)
