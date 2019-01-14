const buildWhereClauseFromAttributes = (schema, attributes = {}, where = []) => {
  for (const { attribute, column } of schema.columns) {
    if (typeof attributes[attribute] !== 'undefined') {
      where.push(`${schema.table}.${column} = $${where.length + 1}`);
    }
  }

  return where;
};

const buildWhereClauseFromId = (schema, id, where = []) => {
  if (typeof id !== 'undefined') {
    where.push(`${schema.table}.${schema.id.name} = $${where.length + 1}`);
  }

  return where;
};

const buildWhereClauseExpressionsFromRelationship = (definition, relationship, where = []) => {
  const targets = Array.isArray(relationship.data) ? relationship.data : [relationship.data];
  let index = where.length + 1;

  const expressions = targets.map((target) => {
    const expression = [];
    for (const { attribute, column } of definition.columns) {
      if (target[attribute]) {
        expression.push(`${definition.table}.${column} = $${index}`);
        index += 1;
      }
    }
    return expression.join(' AND ');
  });

  if (expressions.length > 1) {
    where.push(`( ${expressions.join(' OR ')} )`);
  } else {
    where.push(expressions.join(''));
  }
};

const buildWhereClauseFromRelationships = (schema, relationships = {}, where = []) => {
  for (const definition of schema.relationships) {
    const { [definition.name]: relationship } = relationships;

    if (relationship) {
      buildWhereClauseExpressionsFromRelationship(definition, relationship, where);
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
