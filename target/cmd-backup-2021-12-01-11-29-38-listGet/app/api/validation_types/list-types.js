const listCreateDtoInType = shape({
  name: string(1, 30).isRequired(),
  description: uu5String(4000),
  deadline: date(),
});
