declare module 'react' {
  const content: any
  export default content
}
declare module 'react-dom' {
  let version: string
  let render: Function
  let hydrate: Function
  let findDOMNode: Function
  let unmountComponentAtNode: Function
  let createPortal: Function
  let unstable_batchedUpdates: Function
  let unstable_renderSubtreeIntoContainer: Function
}
