import React, { useState, useCallback, useEffect } from 'react'
import './index.css'

export default function App () {
  console.log('useState', useState)
  const [count, setCount] = useState(2)
  return <button>Hello { count }</button>
}