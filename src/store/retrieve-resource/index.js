import listResources from '../list-resources';

const toResourceRelationship = (definition, records) => {
  const relationship = records.map((record) => definition.columns.reduce((attributes, { attribute, column }) => {
    attributes[attribute] = record[column];
    return attributes;
  }, {}));

  if (relationship.length === 1) {
    return relationship[0];
  }

  return relationship;
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

const retrieveResource = (schema) => (query = {}) => async (read) => {
  const [resource] = await listResources(schema)(query)(read);

  if (!resource) {
    return resource;
  }

  const relationships = await Promise.all(schema.relationships.map((relationship) => read(`SELECT ${relationship.columns.map(({ column }) => column).join(', ')} FROM ${relationship.table} WHERE ${schema.id.name} = $1`, [resource.id])));

  resource.relationships = toResourceRelationships(schema.relationships, relationships);

  return resource;
};

export default retrieveResource;
