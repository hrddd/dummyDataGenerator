import React, {useMemo, useCallback, useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useActions } from '../lib/useActions'
import { setTemplate } from '../store'

const isJSON = (arg: string) => {
  try {
    JSON.parse(arg);
    return true;
  } catch (e) {
    return false;
  }
};

const templateSelector = state => state.template

function Uploader () {
  const template = useSelector(templateSelector)
  const dispatchSetTemplate = useActions(setTemplate, [])
  const [isError, setError] = useState(false)
  const templateStr = JSON.stringify(template)
  
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e: Event) {
      const content = reader.result;
      
      if(typeof content === 'string' && isJSON(content)) {
        setError(false)
        dispatchSetTemplate(JSON.parse(content))
      } else {
        setError(true)
      }
    };
    reader.readAsText(file);
  }, [])

  return (
    <>
      <form>
        <input type="file" onChange={ onFileChange } />
      </form>
      {isError ? (<span>fileTypeError</span>) : (<div>
        <h2>your uploaded file is</h2>
        {templateStr}
      </div>)}
    </>
  )
}
// Uploader.getInitialProps = ({ reduxStore, req }) => {}

export default Uploader
