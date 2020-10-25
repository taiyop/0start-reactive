'use strict';

// export const h = function(tag, props, children) {
//   return {
//     tag,
//     props,
//     children
//   }
// }
var mount = function (vnode, el) {
    vnode.el = document.createElement(vnode.tag);
    for (var key in vnode.props) {
        vnode.el.setAttribute(key, vnode.props[key]);
    }
    if (typeof vnode.children === 'string') {
        vnode.el.textContent = vnode.children;
    }
    else {
        vnode.children.forEach(function (child) {
            mount(child, vnode.el); // Recursively mount the children
        });
    }
    el.appendChild(vnode.el);
};
var unmount = function (vnode) {
    vnode.el.parentNode.removeChild(vnode.el);
};

var patch = function (currentNode, newNode) {
    newNode.el = currentNode.el;
    // Case that the nodes are different tag
    if (currentNode.tag != newNode.tag) {
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
                newNode.children.forEach(function (child) { return mount(child, newNode.el); });
            }
            else {
                var commonLength = Math.min(currentNode.children.length, newNode.children.length);
                for (var i = 0; i < commonLength; i++) {
                    patch(currentNode.children[i], newNode.children[i]);
                }
                if (currentNode.children.length > newNode.children.length) {
                    currentNode.children.slice(newNode.children.length).forEach(function (child) {
                        unmount(child);
                    });
                }
                else if (currentNode.children.length < newNode.children.length) {
                    newNode.children.slice(currentNode.children.length).forEach(function (child) {
                        mount(child, newNode.el);
                    });
                }
            }
        }
    }
};

var compile = function (template) {
    var renderFn = "\n    const h = function(tag, props, children) {\n      return {\n        tag,\n        props,\n        children\n      }\n    }\n    \n    return function render() {\n      let vnode = h('div', { class: 'container' }, [\n        h('h1', { class: 'title' }, 'hello world'),\n        h('span', null, 'I am ' + state.name ),\n        h('p', null, state.name + ' got ' + state.point + ' point')\n      ]);\n\n      return vnode;\n    }\n  ";
    return renderFn;
};

var currentVnode;
var setCurrentVnode = function (node) {
    currentVnode = node;
};
var getCurrentVnode = function () {
    return currentVnode;
};

var subscribers = new Set();
var state = {
    point: 1,
    name: 'taiyop'
};
var renderFn = compile();
var newRender = new Function(renderFn)();
var action = function () {
    var newVnode = newRender();
    patch(getCurrentVnode(), newVnode);
    setCurrentVnode(newVnode);
};
function reactive(state) {
    Object.keys(state).forEach(function (key) {
        var value = state[key];
        Object.defineProperty(state, key, {
            get: function () {
                subscribers.add(action);
                return value;
            },
            set: function (newValue) {
                if (newValue !== value) {
                    value = newValue;
                    subscribers.forEach(function (sub) { return sub(); });
                }
            }
        });
    });
}
reactive(state);
var vueEl = document.getElementById('app');
setCurrentVnode(newRender());
/*
 * このタイミングでstate.countなどがgetされて、
 * subscribersに登録、setしたときに実行される
 */
mount(getCurrentVnode(), vueEl);
