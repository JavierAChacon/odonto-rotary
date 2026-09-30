import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

export const accessControl = createAccessControl(defaultStatements);

export const applicationRoles = {
  admin: accessControl.newRole(adminAc.statements),
  staff: accessControl.newRole({}),
  dentist: accessControl.newRole({}),
};
