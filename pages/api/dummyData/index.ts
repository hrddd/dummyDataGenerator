import { NextApiRequest, NextApiResponse } from 'next'
import { dummyTypes } from '../../../dummyTypes'
import { mapValues } from 'lodash'
import Dummy from 'dummy-jp';
import dummyDescriptionTemplate from 'dummy-jp/model/merosu.json'

const dummy = new Dummy({model: dummyDescriptionTemplate});

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'POST':
      const dummyData = [];
      const template = {...req.body};
      const dummyDataLength = template._dummyDataLength;
      delete template._dummyDataLength;
      for(let i = 0; i < dummyDataLength; i++) {
        const dummyDataItem = mapValues(template, (value, key: string)=>{
          switch(key) {
            case dummyTypes.DESCRIPTION: 
              return dummy.generate()
            default:
              return value
          }
        })
        dummyData.push(dummyDataItem)
      }
      res.status(200).json(JSON.stringify(dummyData))
  }
}