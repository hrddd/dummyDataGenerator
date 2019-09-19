import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const modifiedData = [];
  const template = {...req.body};
  const range = template._range;
  delete template._range;
  for(let i = 0; i < range - 1; i++) {
    modifiedData.push({...template}) // TODO generate dummy
  }
  switch(req.method) {
    case 'POST':
      res.status(200).json(JSON.stringify(modifiedData))
  }
}