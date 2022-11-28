import { supabase } from 'lib/auth';
import { descriptor, getUserById } from 'collections';
import { serializable, errorToJSON } from 'utils';

const handler = supabase()(async (req, res) => {
  try {
    if (req.method == 'GET') {
      const doc = await descriptor(getUserById)(req.auth.id);
      res.send({
        success: true,
        data: serializable(doc),
      });
      return;
    }

    const { name = 'World' } = req.query;
    res.send(`Hello ${name}!`);
  } catch (error) {
    res.status(500).json({ data: errorToJSON(error) });
  }
});

export default handler;
