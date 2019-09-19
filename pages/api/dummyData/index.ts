import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const modifiedData = {...req.body}
  modifiedData.addParamFromServer = 'hello'
  switch(req.method) {
    case 'POST':
      res.status(200).json(JSON.stringify(modifiedData))
  }
}