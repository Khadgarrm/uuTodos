/* eslint-disable */

const initDtoInType = shape({
  code: code().isRequired(),
  name: string(100).isRequired(),
  description: uu5String(4000),
  uuAppProfileAuthorities: uri().isRequired()
});
