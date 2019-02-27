export const root = '/';
export const users = '/users';
export const userGroups = '/user-groups';
export const newUserGroup = '/new-user-group';
export const newUser = '/new-user';
export const account = '/account';
export const userGroup = (userGroupId:string) => '/user-groups/' + userGroupId;
export const user = (userId:string) => '/users/' + userId;
