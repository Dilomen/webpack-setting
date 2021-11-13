import React from "react";
import { useState } from "react";
export default function HelloWorld() {
  console.log(useState)
  const [count, setCount] = useState(1);
  return (
    <div>
      Hello World {count}
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  );
}
