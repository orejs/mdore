import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { Request, Response } from 'express';
import { expressjwt } from 'express-jwt';

export type NextApiRequestWithUser = NextApiRequest & {
  auth: { id: string };
};

interface ResponseShape {
  status: number;
  message: string;
}

function isResponse(r: any): r is ResponseShape {
  return r?.status && r?.message;
}
function isPromise(r: any): r is Promise<unknown> {
  return !!r?.then;
}

export function supabase() {
  const filter = expressjwt({
    algorithms: ['HS256'],
    secret: process.env.SECRET!,
  });

  return function authenticate(
    handler: (req: NextApiRequestWithUser, res: NextApiResponse) => unknown | Promise<unknown>,
  ) {
    return async function (
      request: NextApiRequestWithUser,
      response: NextApiResponse,
    ): Promise<void> {
      const expressRequest = request as unknown as Request;
      const error = await new Promise((resolve) =>
        filter(expressRequest, response as unknown as Response, resolve),
      );

      if (isResponse(error)) {
        console.error(error);
        response.status(error.status);
        response.json({ error: error.message });
      } else {
        const res = handler(request, response);
        if (isPromise(res)) {
          await res;
        }
      }
    };
  };
}
