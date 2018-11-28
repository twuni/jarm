const createResource = (schema) => (resource) => async (write) => {
  await write(`INSERT INTO ${schema.table} (${schema.id.name}, ${schema.columns.map(({ column }) => column).join(', ')}) VALUES ($1, ${schema.columns.map((a, index) => `$${index + 2}`).join(', ')})`, [
    resource.id,
    ...schema.columns.map(({ attribute }) => resource.attributes[attribute])
  ]);

  await Promise.all(schema.relationships.map((relationship) => {
    if (!resource.relationships || !resource.relationships[relationship.name] || !resource.relationships[relationship.name].data) {
      return undefined;
    }

    return write(`INSERT INTO ${relationship.table} (${schema.id.name}, ${relationship.columns.map(({ column }) => column).join(', ')}) VALUES ($1, ${relationship.columns.map((a, index) => `$${index + 2}`).join(', ')})`, [
      resource.id,
      ...relationship.columns.map(({ attribute }) => resource.relationships[relationship.name].data[attribute])
    ]);
  }).filter(Boolean));

  resource.type = schema.resource;

  return resource;
};

export default createResource;
