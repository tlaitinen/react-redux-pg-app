import * as userGroups from './user-groups';
import {emptyUserGroupIn} from '../../types/user-groups';
import db from './connection';
import {AccessDenied} from './errors';
import {createAdmin, createGroupAdmin} from './test-util';
describe('userGroups db', () => {
  it('should throw AccessDenied when GroupAdmin tries to add user group', async () => {
    const ga = await createGroupAdmin(db); 
    
    expect(userGroups.insert(db, ga.groupAdmin, emptyUserGroupIn))
      .rejects.toEqual(new AccessDenied('Only admin can add user groups'));
  });
  it('should throw AccessDenied when GroupAdmin tries to update user group', async () => {
    const ga = await createGroupAdmin(db); 
    
    expect(userGroups.update(db, ga.groupAdmin, ga.userGroup.id, ga.userGroup))
      .rejects.toEqual(new AccessDenied('Only admin can modify user groups'));
  });
  
  it('should allow Admin to update and select user group', async () => {
    const admin = await createAdmin(db);
    if (!admin.userGroupId) {
      throw new Error('no user group for admin');
    }
    const ugs = await userGroups.select(db, admin, {ids:[admin.userGroupId]});
    expect(ugs.length).toEqual(1);
    expect(ugs[0].id).toEqual(admin.userGroupId);
    const ug = ugs[0];
    const ug2 = {
      ...ug,
      name: 'modified',
      active: false
    };
    const r = await userGroups.update(db, admin, ug.id, ug2);
    expect(r).toEqual(ug2);
    const ugs2 = await userGroups.select(db, admin, {ids:[ug.id]});
    expect(ugs2).toEqual([ug2]);
  });
});
