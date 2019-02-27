import {IMain, IDatabase, IBaseProtocol} from 'pg-promise';
import pgPromise from 'pg-promise';
import cfg from '../config';
export type DB = IBaseProtocol<any>;

const camelizeColumns = (data:any[]) => {
  const template = data[0];
  for (let prop in template) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
}

const pgp:IMain = pgPromise({
  receive: (data:any[]) => {
    camelizeColumns(data);
  }
});
const db:IDatabase<any> = pgp({
  host: cfg.databaseHost,
  port: cfg.databasePort,
  database: cfg.databaseDatabase,
  user: cfg.databaseUser,
  password: cfg.databasePassword,
  idleTimeoutMillis: 1000
});

export default db;
