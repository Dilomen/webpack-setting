import React from 'react';
import useStatus from './useStatus';
import './index.css'

export default function App () {
  const [status, setStatus] = useStatus();
  // useStatus();
  return <button>{ status } Hello</button>
}