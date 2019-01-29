import listResources from '../list-resources';

const retrieveResource = (schema) => (query = {}) => async (read) => {
  const [resource] = await listResources(schema)(query, { limit: 1 })(read);
  return resource;
};

export default retrieveResource;
