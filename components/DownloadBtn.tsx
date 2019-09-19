import React, {Children} from 'react'

interface Props {
  children: any,
  href: string,
  fileName: string
}

function DownloadBtn (props: Props) {
  return (
    <a href={props.href} download={props.fileName}>
      {props.children}
    </a>
  )
}

export default React.memo(DownloadBtn)