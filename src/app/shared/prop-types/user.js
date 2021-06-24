import { arrayOf, bool, number, shape, string } from 'prop-types';

const organization = shape({
  id: number,
  name: string,
});

const user = shape({
  accountEnabled: bool,
  accountLocked: bool,
  credentialsExpired: bool,
  email: string,
  friendlyName: string,
  fullName: string,
  hash: string,
  lastLoggedInDate: number,
  organizations: arrayOf(organization),
  passwordResetRequired: bool,
  phoneNumber: string,
  role: string,
  subjectName: string,
  title: string,
  userId: number,
});

export default user;
