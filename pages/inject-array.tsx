import fetch from 'isomorphic-unfetch'
import React, {useCallback, useState, useMemo, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useActions } from '../lib/useActions'
import { setBaseTemplate, setInjectTemplate, ReduxState } from '../store'
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

const baseTemplateSelector = (state: ReduxState) => state.baseTemplate
const injectTemplateSelector = (state: ReduxState) => state.injectTemplate

function Index () {
  let baseTemplate = useSelector(baseTemplateSelector)
  let injectTemplate = useSelector(injectTemplateSelector)
  const [dispatchSetBaseTemplate, dispatchSetInjectTemplate] = useActions([setBaseTemplate, setInjectTemplate], [])
  const [dummyDataName, setdummyDataName] = useState('')
  const [dummyDataLength, setdummyDataLength] = useState(1)
  const onDummyDataLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    setdummyDataLength(parseInt(e.target.value, 10))
  }, [])

  // init with localStrage
  useEffect(()=>{
    if(canUseLocalStrage) {
      setdummyDataName(localStorage.getItem('dummyDataName'))
      dispatchSetBaseTemplate(JSON.parse(localStorage.getItem('dummyDataBaseTemplate')) || null)
      dispatchSetInjectTemplate(JSON.parse(localStorage.getItem('dummyDataInjectTemplate')) || null)
    }
  }, [])

  // file upload
  const [isBaseError, setBaseError] = useState(false)
  const [isInjectError, setInjectError] = useState(false)
  const [dummyData, setDummyData] = useState(null)
  
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'base' | 'inject')=>{
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e: Event) {
      const content = reader.result;
      const fileName = file.name
      if(typeof content === 'string' && isJSON(content)) {
        type === 'base' ? setBaseError(false) : setInjectError(false)
        if(canUseLocalStrage) {
          localStorage.setItem('dummyDataName', fileName);
          setdummyDataName(fileName)
          if(type === 'base') {
            localStorage.setItem('dummyDataBaseTemplate', JSON.stringify(JSON.parse(content)));
            dispatchSetBaseTemplate(JSON.parse(content))
          } else {
            localStorage.setItem('dummyDataInjectTemplate', JSON.stringify(JSON.parse(content)));
            dispatchSetInjectTemplate(JSON.parse(content))
          }
        }
      } else {
        type === 'base' ? setBaseError(true) : setInjectError(true)
      }
    };
    reader.readAsText(file);
  }, [])

  const onFileChangeBase = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    onFileChange(e, 'base')
  }, [])
  const onFileChangeInject = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    onFileChange(e, 'inject')
  }, [])

  // inject
  // TODO memolize dep [store state template, dummyDataLength]...
  const [injectQuery, setInjectQuery] = useState(null)
  const onChangeInjectQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    setInjectQuery(e.target.value)
  }, [])
  const generareDummyData = async ()=>{
    const response = await fetch('/api/injectData', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(Object.assign({}, {
        baseTemplate,
        injectTemplate,
        injectQuery
      }))
    })
    setDummyData(await response.json())
  }
  
  const isNoError = useMemo(()=>{
    return !isBaseError && !isInjectError
  },[isBaseError, isInjectError])
  const hasAllTemplate = baseTemplate !== null && baseTemplate !== null

  // file download
  const downloadHref = useMemo(()=>{
    return "data:application/octet-stream," + encodeURIComponent(JSON.stringify(dummyData));
  }, [dummyData])
  return (
    <>
    <h2>Base Template is</h2>
    <Uploader template={baseTemplate} onFileChange={onFileChangeBase} isError={isBaseError}/>
    <h2>Inject Template is</h2>
    <Uploader template={injectTemplate} onFileChange={onFileChangeInject} isError={isInjectError}/>
    {isNoError && hasAllTemplate && 
      (<>
        <input type="text" defaultValue={injectQuery} onChange = {onChangeInjectQuery} placeholder="please input inject query like 'inject --key posts --match id/author_id --pick id/title/star'"/>
        <Btn onClick={generareDummyData}>Generare dummy data!!</Btn>
      </>)
    }
    {isNoError && dummyData !== null && 
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
