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

const buildValuesFromRelationship = (definition, relationship, values = []) => {
  const targets = Array.isArray(relationship.data) ? relationship.data : [relationship.data];

  for (const target of targets) {
    for (const { attribute } of definition.columns) {
      const { [attribute]: value } = target;

      if (value) {
        values.push(value);
      }
    }
  }
};

const buildValuesFromRelationships = (schema, relationships = {}, values = []) => {
  for (const definition of schema.relationships) {
    const { [definition.name]: relationship } = relationships;

    if (relationship) {
      buildValuesFromRelationship(definition, relationship, values);
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
