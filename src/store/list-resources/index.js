const listResources = (schema) => () => async (read) => {
  const records = await read(`SELECT ${schema.id.name}, ${schema.columns.map(({ column }) => column).join(', ')} FROM ${schema.table}`);

  return records.map((record) => ({
    attributes: schema.columns.reduce((attributes, { attribute, column }) => {
      attributes[attribute] = record[column];
      return attributes;
    }, {}),
    id: record[schema.id.name],
    // TODO: Include relationships here.
    relationships: {},
    type: schema.resource
  }));
};

export default listResources;
