import buildJoinClause from './build-join-clause';
import buildValues from './build-values';
import buildWhereClause from './build-where-clause';
import toProcessableType from '../../helpers/to-processable-type';

const toResourceRelationship = (definition, records) => {
  const relationships = records.map((record) => definition.columns.reduce((attributes, { attribute, column }) => {
    attributes[attribute] = record[column];
    return attributes;
  }, {}));

  return relationships;
};

const toResourceRelationships = (definitions, recordSets) => definitions.reduce((relationships, definition, index) => {
  const { [index]: records } = recordSets;
  if (records) {
    relationships[definition.name] = {
      data: toResourceRelationship(definition, records)
    };
  }
  return relationships;
}, {});

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

const defaultOptions = {
  limit: Infinity,
  shallow: false
};

const listResources = (schema) => (query = {}, {
  limit = defaultOptions.limit,
  shallow = defaultOptions.shallow
} = defaultOptions) => async (read) => {
  const records = await read(buildStatement(schema, query), buildValues(schema, query).map(toProcessableType));
  const resources = records.map((record) => ({
    attributes: schema.columns.reduce((attributes, { attribute, column }) => {
      attributes[attribute] = record[column];
      return attributes;
    }, {}),
    id: record[schema.id.name],
    type: schema.resource
  })).slice(0, limit);

  if (shallow) {
    return resources;
  }

  return Promise.all(resources.map(async (resource) => {
    const relationships = await Promise.all(schema.relationships.map((relationship) => read(`SELECT ${relationship.columns.map(({ column }) => column).join(', ')} FROM ${relationship.table} WHERE ${schema.id.name} = $1`, [resource.id])));

    resource.relationships = toResourceRelationships(schema.relationships, relationships);

    return resource;
  }));
};

export default listResources;
