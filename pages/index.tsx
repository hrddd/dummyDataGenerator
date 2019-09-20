import fetch from 'isomorphic-unfetch'
import React, {useCallback, useState, useMemo, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useActions } from '../lib/useActions'
import { setTemplate, ReduxState } from '../store'
import Uploader from '../components/Uploader'
import Btn from '../components/Btn'
import DownloadBtn from '../components/DownloadBtn'
import canUseLocalStrage from '../lib/canUseLocalStrage';
import JSONViewer from 'react-json-viewer';

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
  let template = useSelector(templateSelector)
  const [dispatchSetTemplate] = useActions([setTemplate], [])
  const [dummyDataName, setdummyDataName] = useState('')
  const [dummyDataLength, setdummyDataLength] = useState(1)
  const onDummyDataLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    setdummyDataLength(parseInt(e.target.value, 10))
  }, [])

   // TODO memolize dep [store state template, dummyDataLength]...
  const generareDummyData = async ()=>{
    const response = await fetch('/api/dummyData', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(Object.assign({}, template, {_dummyDataLength: dummyDataLength}))
    })
    setDummyData(await response.json())
  }
  // init with localStrage
  useEffect(()=>{
    if(canUseLocalStrage) {
      setdummyDataName(localStorage.getItem('dummyDataName'))
      dispatchSetTemplate(JSON.parse(localStorage.getItem('dummyDataTemplate')) || null)
    }
  }, [])

  // file upload
  const [isError, setError] = useState(false)
  const [dummyData, setDummyData] = useState(null)
  
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e: Event) {
      const content = reader.result;
      const fileName = file.name
      if(typeof content === 'string' && isJSON(content)) {
        setError(false)
        if(canUseLocalStrage) {
          localStorage.setItem('dummyDataName', fileName);
          localStorage.setItem('dummyDataTemplate', JSON.stringify(JSON.parse(content)));
        }
        setdummyDataName(fileName)
        dispatchSetTemplate(JSON.parse(content))
      } else {
        setError(true)
      }
    };
    reader.readAsText(file);
  }, [])

  // file download
  const downloadHref = useMemo(()=>{
    return "data:application/octet-stream," + encodeURIComponent(JSON.stringify(dummyData));
  }, [dummyData])

  return (
    <>
    <h2>Template is</h2>
    <Uploader template={template} onFileChange={onFileChange} isError={isError}/>
    {!isError && template !== null && 
      (<>
        <input type="range" min="1" max="1000" defaultValue={`${dummyDataLength}`} onChange = {onDummyDataLengthChange} />
        dummyDataLength: {dummyDataLength}
        <Btn onClick={generareDummyData}>Generare dummy data!!</Btn>
      </>)
    }
    {!isError && dummyData !== null && 
      <>
        <DownloadBtn href={downloadHref} fileName={dummyDataName}>Download dummy data</DownloadBtn>
        <h2>Generated data is</h2>
        <JSONViewer json={dummyData} />
      </>
    }
    </>
  )
}
// Uploader.getInitialProps = ({ reduxStore, req }) => {}

export default Index
