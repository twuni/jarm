const buildValuesFromAttributes = (schema, attributes = {}, values = []) => {
  for (const { attribute } of schema.columns) {
    const { [attribute]: value } = attributes;

    if (value) {
      values.push(value);
    }
  }

  return values;
};

const buildValuesFromId = (schema, id, values = []) => {
  if (id) {
    values.push(id);
  }

  return values;
};

const buildValuesFromRelationships = (schema, relationships = {}, values = []) => {
  for (const definition of schema.relationships) {
    const { [definition.name]: relationship } = relationships;

    if (relationship) {
      for (const { attribute } of definition.columns) {
        const { data: { [attribute]: value } } = relationship;

        if (value) {
          values.push(value);
        }
      }
    }
  }

  return values;
};

const buildValues = (schema, query = {}) => {
  const values = [];

  buildValuesFromId(schema, query.id, values);
  buildValuesFromAttributes(schema, query.attributes, values);
  buildValuesFromRelationships(schema, query.relationships, values);

  return values;
};

export default buildValues;
