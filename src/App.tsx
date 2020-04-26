import React from 'react'
import Classnames from 'classnames/bind'
// import css from './index.css'
const css = require('./index.css')
const cs = Classnames.bind(css)
class App extends React.Component {
  render() { 
    return <p className={cs("text")}>2dh67dsds89</p>
  }
}
 
export default App;