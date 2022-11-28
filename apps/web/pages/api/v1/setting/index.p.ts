// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { errorToJSON } from 'utils';
import { descriptor, getSetting } from 'collections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const ret = {
        name: await descriptor(getSetting)('name', 'Bore CMS'),
        description: await descriptor(getSetting)(
          'description',
          'Bore 是一款支持多平台发布的CMS，通过后台文章管理的发布功能可以把站点文章同时发布到微信公众号、知乎和掘金等平台。',
        ),
      };
      res.status(200).json(ret);
      return;
    }

    res.status(404).json({ msg: '没有该接口' });
    return;
  } catch (error) {
    res.status(500).json({ data: errorToJSON(error) });
  }
}
