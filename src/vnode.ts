let currentVnode
export const setCurrentVnode = function(node) {
  currentVnode = node;
}

export const getCurrentVnode = function() {
  return currentVnode;
}
