export const compile = function(template) {
  const renderFn = `
    const h = function(tag, props, children) {
      return {
        tag,
        props,
        children
      }
    }
    
    return function render() {
      let vnode = h('div', { class: 'container' }, [
        h('h1', { class: 'title' }, 'hello world'),
        h('span', null, 'I am ' + state.name ),
        h('p', null, state.name + ' got ' + state.point + ' point')
      ]);

      return vnode;
    }
  `

  return renderFn
}
