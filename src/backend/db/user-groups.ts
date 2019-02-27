import {userGroups as sql} from './sql';
import {User} from '../../types/users';
import {DB} from './connection';
import {InternalError, AccessDenied, NotFound} from './errors';
import {InsertInfo} from './insert-info';
import {
  UserGroupIn,
  UserGroup,
  Query,
  types
} from '../../types/user-groups';
import {userI18n} from '../languages';

export function insert(db:DB, auth:User, userGroup:UserGroupIn):Promise<UserGroup> {
  const i18n = userI18n(auth);
  return db.tx(async tx => {
    if (!auth.admin) {
      throw new AccessDenied(i18n.gettext('Only admin can add user groups'));
    }
    if (userGroup.userGroupId) {
      const ug = await select(tx, auth, {
        ids: [userGroup.userGroupId],
        userGroupId: userGroup.userGroupId
      });
      if (ug.length !== 1) {
        throw new NotFound(i18n.gettext('Parent user group not found when inserting user group'));
      }
    }


    const row:InsertInfo = await tx.one(sql.insert, userGroup);
    const ugs = await select(tx, auth, {ids: [row.id]});
    if (ugs.length !== 1) {
      throw new InternalError(i18n.gettext('Could not select user group after inserting it'));
    }
    return ugs[0];
  });
}
export async function createUserGroupIfNotExists(db:DB, userGroup:UserGroupIn):Promise<string> {
  const ugs = await db.any(sql.select, {
    ...types.emptyQuery,
    name: userGroup.name
  });
	if (ugs.length !== 0) {
		return ugs[0].id;
	}
  const ug = await db.one(sql.insert, userGroup);
  return ug.id;
}
export async function update(db:DB, auth:User, userGroupId:string, userGroup:UserGroupIn):Promise<UserGroup> {
  const i18n = userI18n(auth);
  if (!auth.admin) {
    throw new AccessDenied(i18n.gettext('Only admin can modify user groups'));
  }
  if (userGroup.userGroupId) {
    const ug = await select(db, auth, {
      ids: [userGroup.userGroupId],
      userGroupId: userGroup.userGroupId
    });
    if (ug.length !== 1) {
      throw new NotFound(i18n.gettext('Parent user group not found when modifying user group'));
    }
  }
  const ug = {
    ...userGroup,
    id: userGroupId
  };
  await db.none(sql.update, ug);
  return ug;
}
export function select(db:DB, auth:User, query:Query):Promise<UserGroup[]> {
  return db.any(sql.select, {
    ...types.emptyQuery,
    ...query,
    userGroupId: auth.admin ? query.userGroupId : (auth.userGroupId || '0'),
  });
}

export const api = {insert, update, select};
