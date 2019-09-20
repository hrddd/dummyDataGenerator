import React from 'react'
import JSONViewer from 'react-json-viewer';
import styled from 'styled-components'

const Scroller = styled.div`
  overflow: scroll;
  padding: 8px;
  width: 100%;
  max-height: 200px;
  border: 2px solid #ddd;
  border-radius: 2px;
  box-sizing: border-box;
`

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
      {props.isError && (<span>fileTypeError</span>)}
      {props.template && (<div>
        <Scroller>
          <JSONViewer json={props.template} />
        </Scroller>
      </div>)}
    </>
  )
}

export default React.memo(Uploader)