const toProcessableType = (value) => {
  if (typeof value === 'boolean') {
    return Number(value);
  }
  return value;
};

export default toProcessableType;
