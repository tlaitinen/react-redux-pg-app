import cfg from './config';
import db from './db/connection';
import * as users from './db/users';
import * as userGroups from './db/user-groups';
import {emptyUserIn} from '../types/users';
import {emptyUserGroupIn} from '../types/user-groups';
if (cfg.adminEmail && cfg.adminPassword) {
  db.tx(async tx => {
    if (!cfg.adminEmail || !cfg.adminPassword) {
      return;
    }
    const ugId = await userGroups.createUserGroupIfNotExists(tx, {
      ...emptyUserGroupIn,
      name: cfg.adminEmail
    });
    await users.createUserIfNotExists(tx, {
      ...emptyUserIn,
      email: cfg.adminEmail,
      userGroupId: ugId,
      admin: true,
    }, cfg.adminPassword);
  });
}

