const updateResource = (schema) => (resource) => async (write) => {
  await write(`UPDATE ${schema.table} SET ${schema.columns.map(({ column }, index) => `${column} = $${index + 2}`).join(', ')} WHERE ${schema.id.name} = $1`, [
    resource.id,
    ...schema.columns.map(({ attribute }) => resource.attributes[attribute])
  ]);

  await Promise.all(schema.relationships.map((relationship) => {
    if (!resource.relationships || !resource.relationships[relationship.name] || !resource.relationships[relationship.name].data) {
      return undefined;
    }

    let { relationships: { [relationship.name]: { data: rows } } } = resource;

    if (typeof rows.length === 'undefined') {
      rows = [rows];
      resource.relationships[relationship.name].data = rows;
    }

    return Promise.all(rows.map((row) => write(`INSERT INTO ${relationship.table} (${schema.id.name}, ${relationship.columns.map(({ column }) => column).join(', ')}) VALUES ($1, ${relationship.columns.map((_, index) => `$${index + 2}`).join(', ')}) ON CONFLICT (${schema.id.name}) DO UPDATE SET ${relationship.columns.map(({ column }) => `${column} = EXCLUDED.${column}`).join(', ')}`, [
      resource.id,
      ...relationship.columns.map(({ attribute }) => row[attribute])
    ])));
  }).filter(Boolean));

  resource.type = schema.resource;

  return resource;
};

export default updateResource;
