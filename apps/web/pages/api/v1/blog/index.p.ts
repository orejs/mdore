import { errorToJSON } from 'utils';
import { supabase } from 'lib/auth';
import { descriptor, createBlog, findBlogAndCount } from 'collections';

const handler = supabase()(async (req, res) => {
  try {
    if (req.method === 'GET') {
      const current = +(req.query.current || 1) - 1;
      const pageSize = +(req.query.pageSize || 10);
      const ret = await descriptor(findBlogAndCount)({
        current,
        pageSize,
        fields: ['_id', 'title', 'slug', 'recommend', 'createdAt', 'updatedAt'],
      });
      res.status(200).json(ret);
      return;
    }
    if (req.method === 'POST') {
      const { slug, title, content, tags, cover, recommend, description } = req.body;
      const blog = await descriptor(createBlog)({
        slug,
        title,
        content,
        tags,
        cover,
        recommend,
        description,
      });
      res.status(200).json({ id: blog.id });
      return;
    }

    res.status(404).json({ msg: '没有该接口' });
    return;
  } catch (error) {
    res.status(500).json({ data: errorToJSON(error) });
  }
});

export default handler;
