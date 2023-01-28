import humps from 'humps';
import { is } from 'ramda';

export const decamelize = (obj) => {
  if (!is(Object, obj) || is(Blob, obj) || is(Function, obj) || is(Date, obj)) return obj;

  if (is(Array, obj)) return obj.map(decamelize);

  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({ ...acc, [humps.decamelize(key)]: decamelize(value) }),
    {},
  );
};

export const camelize = (obj) => humps.camelizeKeys(obj);
