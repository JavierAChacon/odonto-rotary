export const AUTH_CODE = {
  mustChangePassword: 'MUST_CHANGE_PASSWORD',
} as const;

type AuthCode = (typeof AUTH_CODE)[keyof typeof AUTH_CODE];

export const AUTH_MESSAGE: Record<AuthCode, string> = {
  [AUTH_CODE.mustChangePassword]:
    'Debes cambiar tu contraseña temporal para continuar.',
};
