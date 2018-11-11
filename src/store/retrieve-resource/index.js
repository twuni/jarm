const retrieveResource = (schema) => ({ id }) => async (read) => {
  const [record] = await read(`SELECT ${schema.id.name}, ${schema.columns.map(({ column }) => column).join(', ')} FROM ${schema.table} WHERE ${schema.id.name} = $1`, [id]);

  return record && {
    attributes: schema.columns.reduce((attributes, { attribute, column }) => {
      attributes[attribute] = record[column];
      return attributes;
    }, {}),
    id: record[schema.id.name],
    // TODO: Include relationships here.
    relationships: {},
    type: schema.resource
  };
};

export default retrieveResource;
