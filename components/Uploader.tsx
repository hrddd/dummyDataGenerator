import React from 'react'
import JSONViewer from 'react-json-viewer';

interface Props {
  template: JSON,
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isError: boolean
}

function Uploader (props: Props) {
  return (
    <>
      <form>
        <input type="file" onChange={ props.onFileChange } />
      </form>
      {props.isError ? (<span>fileTypeError</span>) : (<div>
        <h2>Template is</h2>
        <JSONViewer json={props.template || {}} />
      </div>)}
    </>
  )
}
// Uploader.getInitialProps = ({ reduxStore, req }) => {}

export default React.memo(Uploader)