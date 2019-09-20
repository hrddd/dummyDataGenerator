import { NextApiRequest, NextApiResponse } from 'next'
import { pick } from 'lodash'
import getOptions from '../getOptions'

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'POST':
      const dummyData = [...req.body.baseTemplate];
      const baseTemplateLength = dummyData.length;
      const injectTemplate = req.body.injectTemplate;
      const injectQuery = req.body.injectQuery;
      const options = getOptions(injectQuery)
      const matchesKey = options.match.split('/')
      const injectKey = options.key
      const pickedParam = options.pick.split('/')

      for(let i = 0; i < baseTemplateLength; i++) {
        dummyData[i][injectKey] = injectTemplate.filter((item, index)=>{
          return dummyData[i][matchesKey[0]] === item[matchesKey[1]]
        }).map((item)=>{
          return pick(item, pickedParam)
        })
      }
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