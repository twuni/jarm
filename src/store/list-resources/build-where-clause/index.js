const buildWhereClauseFromAttributes = (schema, attributes = {}, where = []) => {
  for (const { attribute, column } of schema.columns) {
    if (typeof attributes[attribute] !== 'undefined') {
      where.push(`${column} = $${where.length + 1}`);
    }
  }

  return where;
};

const buildWhereClauseFromId = (schema, id, where = []) => {
  if (typeof id !== 'undefined') {
    where.push(`${schema.id.name} = $${where.length + 1}`);
  }

  return where;
};

const buildWhereClauseFromRelationships = (schema, relationships = {}, where = []) => {
  for (const definition of schema.relationships) {
    const { [definition.name]: relationship } = relationships;

    if (relationship) {
      for (const { attribute, column } of definition.columns) {
        const { data: { [attribute]: value } } = relationship;

        if (value) {
          where.push(`${definition.table}.${column} = $${where.length + 1}`);
        }
      }
    }
  }

  return where;
};

const buildWhereClause = (schema, query = {}) => {
  const where = [];

  buildWhereClauseFromId(schema, query.id, where);
  buildWhereClauseFromAttributes(schema, query.attributes, where);
  buildWhereClauseFromRelationships(schema, query.relationships, where);

  return where.length > 0 ? ` WHERE ${where.join(' AND ')}` : '';
};

export default buildWhereClause;
