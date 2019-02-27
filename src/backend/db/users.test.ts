import * as users from './users';
import db from './connection';
import {createAdmin} from './test-util';
describe('users db', () => {
  it('setPassword and login test', async () => {
    const admin = await createAdmin(db);
    await users.setPassword(db, admin, {
      userId: admin.id,
      password: 'admin-password'
    });
    const u = await users.login(db, admin.email, 'admin-password');
    expect(u).toEqual({
      auth: admin,
      sessionKey: u.sessionKey
    });
  });
});
