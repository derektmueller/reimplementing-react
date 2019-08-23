
export default {
  createElement: function createElement(
      type, props, children=[]) {

    return {
      type,
      props: {
        children: children.map(child => {
          if(Object.prototype.toString.call(child) 
            === '[object String]') {

            return child;
          } else {
            return child;
          }
        })
      }
    }
  }
}
