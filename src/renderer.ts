import { mount, unmount } from './createApp'

export const patch = function(currentNode, newNode) {
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


