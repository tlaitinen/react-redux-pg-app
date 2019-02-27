import {DB} from './connection';
import * as users from './users';
import * as userGroups from './user-groups';
import {emptyUserIn, User} from '../../types/users';
import {emptyUserGroupIn, UserGroup} from '../../types/user-groups';
let nextUserId = 1;
export async function createAdmin(tx:DB):Promise<User> {
  const email = 'admin' + (nextUserId++) + '@example.com';
  const userGroupId = await userGroups.createUserGroupIfNotExists(tx, {
    ...emptyUserGroupIn,
    name: email
  });
  const userId = await users.createUserIfNotExists(tx, {
    ...emptyUserIn,
    email,
    userGroupId,
    admin: true
  }, null);
  return users.selectById(tx, userId);
}
export async function createGroupAdmin(tx:DB):Promise<{
  userGroup: UserGroup;
  groupAdmin: User
}> {
  const admin = await createAdmin(tx);
  const email = 'group-admin' + (nextUserId++) + '@example.com';
  const userGroup = await userGroups.insert(tx, admin, {
    ...emptyUserGroupIn,
    name: email
  });
  const groupAdmin = await users.insert(tx, admin, {
    ...emptyUserIn,
    email,
    groupAdmin: true,
    userGroupId: userGroup.id
  });
  return {
    userGroup,
    groupAdmin
  };
}
