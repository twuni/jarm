const buildJoinClauseFromRelationships = (schema, relationships = {}, joins = []) => {
  for (const definition of schema.relationships) {
    const { [definition.name]: relationship } = relationships;

    if (relationship) {
      joins.push(`INNER JOIN ${definition.table} ON ${schema.table}.${schema.id.name} = ${definition.table}.${schema.id.name}`);
    }
  }

  return joins;
};

const buildJoinClause = (schema, query = {}) => {
  const joins = [];

  buildJoinClauseFromRelationships(schema, query.relationships, joins);

  return joins.length > 0 ? ` ${joins.join(' ')}` : '';
};

export default buildJoinClause;
