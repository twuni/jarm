import createResource from './create-resource';
import createSchema from './create-schema';
import defaults from './defaults';
import destroyResource from './destroy-resource';
import listResources from './list-resources';
import retrieveResource from './retrieve-resource';
import updateResource from './update-resource';

const Store = function Store(schema) {
  defaults(schema);

  this.createSchema = createSchema(schema);

  this.createResource = createResource(schema);
  this.retrieveResource = retrieveResource(schema);
  this.updateResource = updateResource(schema);
  this.destroyResource = destroyResource(schema);
  this.listResources = listResources(schema);

  this.type = schema.resource;

  return this;
};

export default Store;
