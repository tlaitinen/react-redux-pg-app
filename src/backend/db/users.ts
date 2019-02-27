import {users as sql} from './sql';
import {DB} from './connection';
import {InvalidRequest, InternalError, AccessDenied, NotFound} from './errors';
import argon2 from 'argon2';
import * as crypto from 'crypto';
import * as userGroups from './user-groups';
import {
  UserIn,
  User,
  Query,
  types
} from '../../types/users';
import {InsertInfo} from './insert-info';
import {userI18n} from '../languages';


export function insert(db:DB, auth:User, user:UserIn):Promise<User> {
  const i18n = userI18n(auth);
  if (!auth.userGroupId) {
    throw new AccessDenied(i18n.gettext('User has no user group'));
  }
  return db.tx(async tx => {
    if (!auth.admin && !auth.groupAdmin) {
      throw new AccessDenied(i18n.gettext('Only Admin or GroupAdmin may add users'));
    }
    if (!auth.admin && user.admin) {
      throw new AccessDenied(i18n.gettext('Only Admin can create Admin users'));
    }
    const userGroupId = auth.admin && user.userGroupId || auth.userGroupId;

    try {
      await selectByEmail(tx, user.email);
      throw new InvalidRequest(i18n.gettext('User already exists'));
    } catch (e) {
      if (!(e instanceof NotFound)) {
        throw e;
      }
    }

    const row:InsertInfo = await tx.one(sql.insert, {
      ...user,
      userGroupId
    });
    const us = await select(tx, auth, {ids:[row.id]});
    if (us.length !== 1) {
      throw new InternalError(i18n.gettext('Could not select user after inserting it'));
    }
    return us[0];
  });
}

export async function throwErrorIfCannotModify(db:DB, auth:User, userId:string):Promise<void> {
  const i18n = userI18n(auth);
 
  if (!auth.admin && !auth.groupAdmin && auth.id !== userId) {
    throw new AccessDenied(i18n.gettext('Only Admin or GroupAdmin may modify other users'));
  }
  const users = await select(db, auth, {ids:[userId]});
  if (users.length !== 1) {
    throw new NotFound(i18n.gettext('User not found'));
  }
}
export function update(db:DB, auth:User, userId: string, user:UserIn):Promise<User> {
  const i18n = userI18n(auth);
 
  return db.tx(async tx => {

    await throwErrorIfCannotModify(tx, auth, userId);

    const us = await select(tx, auth, {ids:[userId]});
    if (us.length !== 1) {
      throw new NotFound(i18n.gettext('User not found'));
    }

    if (user.userGroupId) {
      const ug = await userGroups.select(tx, auth, {
        ids: [user.userGroupId],
        userGroupId: user.userGroupId
      });
      if (ug.length !== 1) {
        throw new NotFound(i18n.gettext('User group not found when modifying user'));
      }
    }
    const u = {
      ...user,
      id: userId
    };
    await tx.none(sql.update, u);
    return u;
  }); 
}

export async function setPassword(db:DB, auth:User, {userId,password}:{userId:string, password:string}):Promise<null> {
  return db.tx(async tx => {
    await throwErrorIfCannotModify(tx, auth, userId);
    const hash = await argon2.hash(password);
    return tx.none(sql.updatePassword, {
      userId,
      password: hash
    });
  });
}
export async function verifyPassword(db:DB, auth:User, password:string):Promise<boolean> {
  const pwd = await db.one(sql.selectPassword, {userId: auth.id});
  if (pwd.password) {
    return argon2.verify(pwd.password, password);
  } else {
    return false;
  }
}
export async function selectById(db:DB, userId:string):Promise<User> {
  const us = await db.any(sql.select, {
    ...types.emptyQuery,
    ids: [userId],
    active: true
  });
  if (us.length !== 1) {
    throw new NotFound();
  }
  return us[0];
}

export async function selectByEmail(db:DB, email:string):Promise<User> {
 
  const us = await db.any(sql.select, {
    ...types.emptyQuery,
    email,
    active: true
  });
  if (us.length !== 1) {
    throw new NotFound();
  }
  return us[0];
}

export async function createUserIfNotExists(db:DB, user:UserIn, password:string | null):Promise<string> {
  return db.tx(async tx => {
    const us = await tx.any(sql.select, {
      ...types.emptyQuery,
      email: user.email,
    });
    if (us.length === 1) {
      return us[0].id;
    }
    const u = await tx.one(sql.insert, user);
    if (password !== null) {
      await setPassword(tx, {...user, ...u}, {userId: u.id, password});
    }
    return u.id;
  });
}

export function createSessionKey():Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('base64'));
      }
    });
  });
}

export function login(db:DB, username:string, password:string):Promise<{auth:User; sessionKey:string}> {
 
  return db.tx(async tx => {
    const us = await tx.any(sql.select, {
      ...types.emptyQuery,
      email: username,
      active: true
    });
    if (us.length !== 1) {
      throw new AccessDenied();
    }
    const auth = us[0];
    const ok = await verifyPassword(tx, auth, password);
    if (!ok) {
      throw new AccessDenied();
    }
    const sessionKey:string = await createSessionKey();

    return {
      auth,
      sessionKey
    };
  });
}
export function select(db:DB, auth:User, query:Query):Promise<User[]> {
  return db.any(sql.select, {
    ...types.emptyQuery,
    ...query,
    authId: auth.id,
    userGroupId: auth.admin ? query.userGroupId : (auth.userGroupId || '0'),
  });
}
export const api = {insert, update, select};


