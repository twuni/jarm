const createSchema = (schema) => () => async (write) => {
  await write(`CREATE TABLE IF NOT EXISTS ${schema.table} (${schema.id.name} ${schema.id.type} NOT NULL, ${schema.columns.map(({ column, type }) => `${column} ${type}`).join(', ')}, PRIMARY KEY (${schema.id.name}))`);
  await Promise.all(schema.relationships.map((relationship) => write(`CREATE TABLE IF NOT EXISTS ${relationship.table} (${schema.id.name} ${schema.id.type} NOT NULL REFERENCES ${schema.table} (${schema.id.name}), ${relationship.columns.map(({ column, type }) => `${column} ${type}`).join(', ')}, PRIMARY KEY (${schema.id.name}))`)));
};

export default createSchema;
