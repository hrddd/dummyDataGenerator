import { NextApiRequest, NextApiResponse } from 'next'
import { dummyTypes } from '../../../dummyTypes'
import { mapValues } from 'lodash'
import getOptions from './getOptions'
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
          const options = getOptions(value)
          switch(options.___type___) {
            case dummyTypes.DESCRIPTION:
              return dummy.generate()
            case dummyTypes.NUMBER:
              if(options.mode === 'random' && options.from && options.to) {
                  let randumNum = Math.random() * (options.to - options.from) + options.from;
                  if(options.decimal) {
                    return Math.round(randumNum * (10 ** options.decimal)) / (10 ** options.decimal)
                  } else {
                    return randumNum
                  }
              } else {
                return i * (typeof options.step !== 'undefined' ? options.step : 1)
              }
            default:
              return value
          }
        })
        dummyData.push(dummyDataItem)
      }
      res.status(200).json(JSON.stringify(dummyData))
  }
}