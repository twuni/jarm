const destroyResource = (schema) => ({ id }) => async (write) => {
  await Promise.all(schema.relationships.map((relationship) => write(`DELETE FROM ${relationship.table} WHERE ${schema.id.name} = $1`, [id])));
  await write(`DELETE FROM ${schema.table} WHERE ${schema.id.name} = $1`, [id]);
};

export default destroyResource;
