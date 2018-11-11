const schemaDefaultId = (id) => {
  id.name = id.name || 'id';
  id.type = id.type || 'text';
};

const schemaDefaultColumn = (column) => {
  column.attribute = column.attribute || column.column;
  column.column = column.column || column.attribute;
  column.type = column.type || 'text';
};

const schemaDefaultRelationshipColumn = (column) => {
  column.attribute = column.attribute || column.column;
  column.column = column.column || `related_${column.attribute}`;
  column.type = column.type || 'text';
};

const schemaDefaultRelationship = (relationship, schema) => {
  for (const column of relationship.columns) {
    schemaDefaultRelationshipColumn(column);
  }
  relationship.table = relationship.table || `r_${schema.table}_${relationship.name}`;
};

const schemaDefaultColumns = (columns) => {
  for (const column of columns) {
    schemaDefaultColumn(column);
  }
};

const schemaDefaultRelationships = (relationships, schema) => {
  for (const relationship of relationships) {
    schemaDefaultRelationship(relationship, schema);
  }
};

const schemaDefaults = (schema) => {
  schema.id = schema.id || {};
  schema.table = schema.table || `${schema.resource}s`;
  schemaDefaultId(schema.id);
  schemaDefaultColumns(schema.columns);
  schemaDefaultRelationships(schema.relationships, schema);
};

export default schemaDefaults;
