import React from 'react'
import Classnames from 'classnames/bind'
import css from './index.scss'
// const css = require('./index.css')
const cs = Classnames.bind(css)
class App extends React.Component {
  render() { 
    return <p className={cs("text")}>2345hgh6789</p>
  }
}
 
export default App;