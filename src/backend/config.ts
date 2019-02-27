export interface Config {
  debug: boolean;
  port: number;
  databaseHost: string | undefined;
  databasePort: number;
  databaseUser: string | undefined,
  databaseDatabase: string | undefined;
  databasePassword: string | undefined;
  adminEmail: string | undefined;
  adminPassword: string | undefined;
  cookieName: string;
  sessionKey: string;
  sessionExpires: number;
  baseUrl: string;
} 

const cfg:Config = {
  debug: process.env.DEBUG === 'true',
  port: parseInt(process.env.PORT || '3000'),
  databaseHost: process.env.RDS_HOSTNAME,
  databasePort: parseInt(process.env.RDS_PORT || '5432'),
  databaseDatabase: process.env.RDS_DB_NAME,
  databaseUser: process.env.RDS_USERNAME,
  databasePassword: process.env.RDS_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  cookieName: process.env.COOKIE_NAME || 'SESSION',
  sessionKey: process.env.SESSION_KEY || 'test-session-key',
  sessionExpires: parseInt(process.env.SESSION_EXPIRES || '31536000'),
  baseUrl: process.env.BASE_URL || 'http://localhost:8080'
};
export default cfg;

