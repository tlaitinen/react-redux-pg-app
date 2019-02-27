import {QueryFile} from 'pg-promise';
import cfg from '../../config';
import * as path from 'path';

function sql(file:string):QueryFile {
	const fullPath = path.join(__dirname, file); 
  return new QueryFile(fullPath, {
    minify: true, 
    debug: cfg.debug
  });
}
export const users = {
  select: sql('users/select.sql'),
  selectPassword: sql('users/select-password.sql'),
  insert: sql('users/insert.sql'),
  update: sql('users/update.sql'),
  updatePassword: sql('users/update-password.sql'),
};
export const userGroups = {
  select: sql('user-groups/select.sql'),
  insert: sql('user-groups/insert.sql'),
  update: sql('user-groups/update.sql')
};

