import React, {useMemo} from 'react'

interface Props {
  template: JSON,
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isError: boolean
}

function Uploader (props: Props) {
  const templateStr = useMemo(()=>{
    return JSON.stringify(props.template)
  }, [props.template])

  return (
    <>
      <form>
        <input type="file" onChange={ props.onFileChange } />
      </form>
      {props.isError ? (<span>fileTypeError</span>) : (<div>
        <h2>your uploaded file is</h2>
        {templateStr}
      </div>)}
    </>
  )
}
// Uploader.getInitialProps = ({ reduxStore, req }) => {}

export default React.memo(Uploader)