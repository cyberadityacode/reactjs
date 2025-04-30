const username = 'cyberaditya'

const sampleNameFunc = ()=>{
   return username + ' dc'
}

const showValue = false

const h2 = <h2>Hello JSX <b>{username}</b> <b>{sampleNameFunc()}</b> {showValue.toString()} </h2>


console.log(h2);
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(h2)