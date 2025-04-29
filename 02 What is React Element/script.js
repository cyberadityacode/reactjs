// type, props, children
const h2 = React.createElement('h2',{className: 'subheading'}, 'Hello React')
// const container = React.createElement('div', {className: 'container', id:'container'}, 'Hello Container')
const container = React.createElement('div', {className: 'container', id:'container'}, [
    React.createElement('section', {className: 'section-container',key:1},[
        React.createElement('img', {className:'img-class', src :'kailash.jpg', key:0})
    ]),
    React.createElement('section', {className: 'section-container-2',key:2},[
        React.createElement('img', { style: {width: 200 + 'px', },className:'img-class', src :'kailash.jpg', key:0})
    ])
])
/* const h2 = {
  $$typeof: Symbol.for('react.element'),        
  type: "h2",
  key: null,
  ref: null,
  props: {
    className: "subheading",
    children: "Hello React",
  }, 
  _owner: "Aditya Dubey",
  _store: {},
};
 */

// created custom react element with h2 element and its child text within italic text
/* const h2 = {
    $$typeof: Symbol.for('react.element'),        
    type: "h2",
    key: null,
    ref: null,
    props: {
      className: "subheading",
      children: {
        $$typeof: Symbol.for('react.element'),        
        type: "i",
        key: null,
        ref: null,
        props: {
          className: null,
          children: "Hello React",
        }, 
        _owner: "Aditya Dubey",
        _store: {},
      },
    }, 
    _owner: "Aditya Dubey",
    _store: {},
  };
  
 */
//container, options
const root = ReactDOM.createRoot(document.querySelector("#root"));
//open devtool and execute h2

// how to display this in our page
/* 
Unfortunately, React Doesn't support web browser,
but fortunately, we have ReactDOM as our shaktiman
*/

// to begin with, create a div with id say root
// root has render method in which we pass our react element which furthermore helps us to leverage DOM

// root.render(h2);
root.render(container);

/* How to do the same using vanilla JS */

const h2Element = document.createElement("h2");
h2Element.innerText = "Hello Vanilla JS";

// appending my newly created h2 inside the div(rootVanillaJS)
document.querySelector("#rootVanillaJS").append(h2Element);
