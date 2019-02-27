import * as t from 'io-ts';

export const RequestT = //t.union([
  t.type({
    type: t.literal('set-password'),
    props: t.type({
      userId: t.string,
      password: t.string
    })
  })
;//]);

export type Request = t.TypeOf<typeof RequestT>;
export const ResponseT = // t.union([
  t.type({
    type: t.literal('no-result')
  })
;// ]);
export type Response = t.TypeOf<typeof ResponseT>;
