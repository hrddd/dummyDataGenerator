import React, {Children} from 'react'

interface Props {
  onClick: ()=>void | Promise<any> | boolean,
  children: any
}

function Btn (props: Props) {
  return (
    <button onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default React.memo(Btn)