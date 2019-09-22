import { NextApiRequest, NextApiResponse } from 'next'
import { dummyTypes } from '../../../data/dummyTypes'
import { mapValues } from 'lodash'
import getOptions from '../../../lib/getOptions'
import Dummy from 'dummy-jp'
import dummyDescriptionTemplate from 'dummy-jp/model/merosu.json'
import getRandomJpNameAndKana, {NameAndKana} from '../../../lib/getRandomJpNameAndKana'

const dummy = new Dummy({model: dummyDescriptionTemplate});

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'POST':
      const dummyData = [];
      const template = {...req.body};
      const dummyDataLength = template._dummyDataLength;
      delete template._dummyDataLength;
      for(let i = 0; i < dummyDataLength; i++) {
        let fullName: NameAndKana = null
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
            case dummyTypes.FULLNAME:
              fullName = fullName !== null ? fullName : getRandomJpNameAndKana()
              return fullName.familyName + ' ' + fullName.firstName
            case dummyTypes.FULLNAMEKANA:
              fullName = fullName !== null ? fullName : getRandomJpNameAndKana()
              return fullName.familyNameKana + ' ' + fullName.firstNameKana
            default:
              if(value.indexOf('${n}') >= 0) {
                return value.replace('${n}', i)
              }
              return value
          }
        })
        dummyData.push(dummyDataItem)
      }
      res.status(200).json(JSON.stringify(dummyData))
  }
}