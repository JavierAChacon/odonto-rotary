import { betterAuth } from 'better-auth';
import { admin, openAPI } from 'better-auth/plugins';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { i18n, locales } from '@better-auth/i18n';
import { readRequiredEnvironmentVariable } from '../app.helper.js';
import { prisma } from '../prisma/prisma.service.js';
import { AUTH_MESSAGE } from './auth.constant.js';
import { USER_ROLE } from './user/auth.user.constant.js';
import { accessControl, applicationRoles } from './user/auth.user.helper.js';

export const auth = betterAuth({
  secret: readRequiredEnvironmentVariable('BETTER_AUTH_SECRET'),
  baseURL: readRequiredEnvironmentVariable('BETTER_AUTH_URL'),
  trustedOrigins: [readRequiredEnvironmentVariable('CLIENT_ORIGIN')],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      mustChangePassword: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userBeingCreated) => ({
          data: { ...userBeingCreated, mustChangePassword: true },
        }),
      },
    },
  },
  hooks: {},
  plugins: [
    admin({
      ac: accessControl,
      roles: applicationRoles,
      defaultRole: USER_ROLE.staff,
      adminRoles: [USER_ROLE.admin],
    }),
    i18n({
      translations: { es: { ...locales.es, ...AUTH_MESSAGE } },
      defaultLocale: 'en',
      detection: ['cookie', 'header'],
      localeCookie: 'locale',
    }),
    openAPI(),
  ],
});
