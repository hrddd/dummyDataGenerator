import { NextApiRequest, NextApiResponse } from 'next'
import { dummyTypes } from '../../../dummyTypes'
import { mapValues } from 'lodash'
import getRandomDescription from '../../../lib/getRandomDescription';

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
              return getRandomDescription()
            default:
              return value
          }
        })
        dummyData.push(dummyDataItem)
      }
      res.status(200).json(JSON.stringify(dummyData))
  }
}