import { User } from '.';

export const mapCognitoAttributes = (attributes: any): User => {
  return {
    email: attributes.email,
    name: attributes.name,
    familyName: attributes.family_name,
    sub: attributes.sub,
  };
};
