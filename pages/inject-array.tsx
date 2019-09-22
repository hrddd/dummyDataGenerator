import fetch from 'isomorphic-unfetch'
import React, {useCallback, useState, useMemo, useEffect} from 'react'
import { connect } from 'react-redux'
import { setBaseTemplate, setInjectTemplate, ReduxState } from '../store'
import Uploader from '../components/Uploader'
import Btn from '../components/Btn'
import DownloadBtn from '../components/DownloadBtn'
import canUseLocalStrage from '../lib/canUseLocalStrage';
import JSONViewer from 'react-json-viewer';
import canUseBlob from '../lib/canUseBlob';

const isJSON = (arg: string) => {
  try {
    JSON.parse(arg);
    return true;
  } catch (e) {
    return false;
  }
};

function Page ({setBaseTemplate, setInjectTemplate, baseTemplate, injectTemplate}) {
  const [dummyDataName, setdummyDataName] = useState('')

  // init with localStrage
  useEffect(()=>{
    if(canUseLocalStrage) {
      setdummyDataName(localStorage.getItem('dummyDataName'))
      setBaseTemplate(JSON.parse(localStorage.getItem('dummyDataBaseTemplate')) || null)
      setInjectTemplate(JSON.parse(localStorage.getItem('dummyDataInjectTemplate')) || null)
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
            setBaseTemplate(JSON.parse(content))
          } else {
            localStorage.setItem('dummyDataInjectTemplate', JSON.stringify(JSON.parse(content)));
            setInjectTemplate(JSON.parse(content))
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
  const [injectQuery, setInjectQuery] = useState(null)
  const onChangeInjectQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    setInjectQuery(e.target.value)
  }, [])
  const generareDummyData = useCallback(async ()=>{
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
    response.status === 200 && setDummyData(await response.json())
  },[baseTemplate, injectTemplate, injectQuery])
  
  const isNoError = useMemo(()=>{
    return !isBaseError && !isInjectError
  },[isBaseError, isInjectError])
  const hasAllTemplate = baseTemplate !== null && baseTemplate !== null

  // file download
  const downloadHref = useMemo(()=>{
    if(!canUseBlob) { return '' }
    const blob = new Blob([JSON.stringify(dummyData)], {type:'text/plain'});
    return URL.createObjectURL(blob);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setBaseTemplate: (json: object) => {
      dispatch(setBaseTemplate(json))
    },

    setInjectTemplate: (json: object) => {
      dispatch(setInjectTemplate(json))
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return state
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
