import fetch from 'isomorphic-unfetch'
import React, {useCallback, useState, useMemo} from 'react'
import { useSelector } from 'react-redux'
import { useActions } from '../lib/useActions'
import { setTemplate, ReduxState } from '../store'
import Uploader from '../components/Uploader'
import Btn from '../components/Btn'
import DownloadBtn from '../components/DownloadBtn'

const isJSON = (arg: string) => {
  try {
    JSON.parse(arg);
    return true;
  } catch (e) {
    return false;
  }
};

const templateSelector = (state: ReduxState) => state.template

function Index () {
  // redux
  const template = useSelector(templateSelector)
  const [dispatchSetTemplate] = useActions([setTemplate], [])
  const generareDummyData = async ()=>{
    const response = await fetch('/api/dummyData', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(template)
    })
    setDummyData(await response.json())
  } // TODO store memo...

  // react
  const [isError, setError] = useState(false)
  const [dummyData, setDummyData] = useState(null)
  const dummyDataStr = useMemo(()=>{
    return JSON.stringify(dummyData)
  },[dummyData])
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
  const downloadHref = useMemo(()=>{
    return "data:application/octet-stream," + encodeURIComponent(JSON.stringify(dummyData));
  }, [dummyData])

  return (
    <>
    <Uploader template={template} onFileChange={onFileChange} isError={isError}/>
    {!isError && template !== null && <Btn onClick={generareDummyData}>Generare dummy data!!</Btn>}
    {!isError && dummyData !== null && 
      <>
        <div>{dummyDataStr}</div>
        <DownloadBtn href={downloadHref} fileName={'dummydata.json'}>Download dummy data</DownloadBtn>
      </>
    }
    </>
  )
}
// Uploader.getInitialProps = ({ reduxStore, req }) => {}

export default Index
