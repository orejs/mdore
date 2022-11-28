import { supabase } from 'lib/auth';
import { errorToJSON } from 'utils';
import { BlogInfo, descriptor, getBlogById, updateBlog, updateBlogContent } from 'collections';

const handler = supabase()(async (req, res) => {
  try {
    const id = req.query.id as string;
    const fields = req.query['fields[]'] as Array<keyof BlogInfo>;

    console.log(fields);

    if (req.method === 'GET') {
      const blog = await descriptor(getBlogById)(
        id,
        fields ?? ['_id', 'title', 'slug', 'description', 'recommend', 'cover', 'tags'],
      );
      res.status(200).json(blog.toJSON());
      return;
    }

    if (req.method === 'PUT') {
      const { slug, title, tags, cover, recommend, description } = req.body;

      await descriptor(updateBlog)(id, { slug, title, tags, cover, recommend, description });
      res.status(200).json({ id });
      return;
    }

    if (req.method === 'PATCH') {
      const { content } = req.body;

      await descriptor(updateBlogContent)(id, content);
      res.status(200).json({ id });
      return;
    }

    res.status(404).json({ msg: '没有该接口' });
    return;
  } catch (error: any) {
    res.status(500).json({ data: errorToJSON(error) });
  }
});

export default handler;
