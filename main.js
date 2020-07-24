let subscribers = new Set()

const state = {
  point: 1,
  name: 'taiyop'
};
let currentVnode
const action = () => {
  let newVnode = render();

  patch(currentVnode, newVnode);
  currentVnode = newVnode;
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
          subscribers.forEach((sub) => sub())
        }
      }
    });
  });
}
reactive(state);

function render() {
  let childNode = {
    tag: 'h1',
    props: {
      class: 'title'
    },
    children: 'hello world'
  };

  let childNode2 = {
    tag: 'span',
    props: null,
    children: `I am ${state.name}`
  };

  let stateVnode = {
    tag: 'p',
    props: null,
    children: `${state.name} got ${state.point} point`
  };

  let vnode = {
    tag: 'div',
    props: {
      class: 'container'
    },
    children: [childNode, childNode2, stateVnode]
  };

  return vnode;
}


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

let vueEl = document.getElementById('app');

currentVnode = render();

/*
 * このタイミングでstate.countなどがgetされて、
 * subscribersに登録、setしたときに実行される
 */
mount(currentVnode, vueEl); 
