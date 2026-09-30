export interface Env {
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  CLIENT_ORIGIN: string;
  SEED_ADMIN_EMAIL: string;
  SEED_ADMIN_PASSWORD: string;
  DOCS_BASIC_AUTH_USER: string;
  DOCS_BASIC_AUTH_PASSWORD: string;
}
