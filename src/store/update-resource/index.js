const updateResource = (schema) => (resource) => async (write) => {
  await write(`UPDATE ${schema.table} SET ${schema.columns.map(({ column }, index) => `${column} = $${index + 2}`).join(', ')} WHERE ${schema.id.name} = $1`, [
    resource.id,
    ...schema.columns.map(({ attribute }) => resource.attributes[attribute])
  ]);

  await Promise.all(schema.relationships.map((relationship) => {
    if (!resource.relationships || !resource.relationships[relationship.name] || !resource.relationships[relationship.name].data) {
      return undefined;
    }

    return write(`UPDATE ${relationship.table} SET ${relationship.columns.map(({ column }, index) => `${column} = $${index + 2}`).join(', ')} WHERE ${schema.id.name} = $1`, [
      resource.id,
      ...relationship.columns.map(({ attribute }) => resource.relationships[relationship.name].data[attribute])
    ]);
  }).filter(Boolean));

  return resource;
};

export default updateResource;
