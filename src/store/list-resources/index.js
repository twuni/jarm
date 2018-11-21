import buildJoinClause from './build-join-clause';
import buildValues from './build-values';
import buildWhereClause from './build-where-clause';

const buildStatement = (schema, query) => {
  const joins = buildJoinClause(schema, query);
  const selection = buildWhereClause(schema, query);
  const projection = [
    schema.id.name,
    ...schema.columns.map(({ column }) => column)
  ].map((column) => {
    if (joins) {
      return `${schema.table}.${column} AS ${column}`;
    }
    return column;
  }).join(', ');
  return `SELECT ${projection} FROM ${schema.table}${joins}${selection}`;
};

const listResources = (schema) => (query = {}) => async (read) => {
  const records = await read(buildStatement(schema, query), buildValues(schema, query));

  return records.map((record) => ({
    attributes: schema.columns.reduce((attributes, { attribute, column }) => {
      attributes[attribute] = record[column];
      return attributes;
    }, {}),
    id: record[schema.id.name],
    type: schema.resource
  }));
};

export default listResources;
