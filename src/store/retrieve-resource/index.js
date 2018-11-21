const toResourceAttributes = (definition, record) => definition.columns.reduce((attributes, { attribute, column }) => {
  attributes[attribute] = record[column];
  return attributes;
}, {});

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

const toResource = (schema, record, relationships = []) => ({
  attributes: toResourceAttributes(schema, record),
  id: record[schema.id.name],
  relationships: toResourceRelationships(schema.relationships, relationships),
  type: schema.resource
});

const retrieveResource = (schema) => ({ id }) => async (read) => {
  const [record] = await read(`SELECT ${schema.id.name}, ${schema.columns.map(({ column }) => column).join(', ')} FROM ${schema.table} WHERE ${schema.id.name} = $1`, [id]);

  if (!record) {
    return record;
  }

  const relationships = await Promise.all(schema.relationships.map((relationship) => read(`SELECT ${relationship.columns.map(({ column }) => column).join(', ')} FROM ${relationship.table} WHERE ${schema.id.name} = $1`, [record.id])));

  return toResource(schema, record, relationships);
};

export default retrieveResource;
