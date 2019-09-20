import { NextApiRequest, NextApiResponse } from 'next'
import { dummyTypes } from '../../../dummyTypes'
import { mapValues } from 'lodash'
import getOptions from '../getOptions'
import Dummy from 'dummy-jp'
import dummyDescriptionTemplate from 'dummy-jp/model/merosu.json'

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'POST':
      const dummyData = [];
      
      res.status(200).json(JSON.stringify(dummyData))
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}