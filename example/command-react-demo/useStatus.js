import React, { useState } from 'react';

export default function useStatus() {
  console.log(useState(1))
  const [status, setStatus] = useState(2);
  return [
    status,
    setStatus
  ]
}