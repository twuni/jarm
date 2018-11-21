import buildJoinClause from './build-join-clause';
import buildValues from './build-values';
import buildWhereClause from './build-where-clause';

const listResources = (schema) => (query = {}) => async (read) => {
  const records = await read(`SELECT ${schema.id.name}, ${schema.columns.map(({ column }) => column).join(', ')} FROM ${schema.table}${buildJoinClause(schema, query)}${buildWhereClause(schema, query)}`, buildValues(schema, query));

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
