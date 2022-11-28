import jwt from 'jsonwebtoken';
import { descriptor, AuthorizeByPass } from 'collections';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method == 'POST') {
      const { username, password, type } = req.body;
      if (type !== 'account') return null;
      const doc = await descriptor(AuthorizeByPass)(username, password);
      if (doc === null) {
        res.status(500).json({ status: 'err', msg: '用户名或密码错误' });
        return;
      }
      const user = { id: doc._id.toString() };
      const token = 'Bearer ' + jwt.sign(user, process.env.SECRET!, { expiresIn: 3600 * 24 * 3 });
      res.json({ status: 'ok', token });
      return;
    }
    res.status(404).json({ msg: '没有该接口' });
    return;
  } catch (error) {}
}
