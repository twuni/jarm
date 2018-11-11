import { stub } from '../spec.helpers';

export const mockRead = () => stub().returns([
  {
    // eslint-disable-next-line camelcase
    favorite_color: 'blue',
    id: '<RecordId>',
    priority: 123
  }
]);

export const mockResource = ({ attributes, id, relationships, type } = {}) => ({
  attributes: attributes || {
    favoriteColor: 'yellow',
    priority: 123
  },
  id: id || '<ResourceId>',
  relationships: relationships || {
    owner: {
      data: {
        id: '<UserId>',
        type: 'user'
      }
    }
  },
  type: type || 'widget'
});

export const mockResourceIdentifier = () => ({
  id: '<ResourceId>',
  type: 'widget'
});


export const mockSchema = () => ({
  columns: [
    {
      attribute: 'favoriteColor',
      column: 'favorite_color'
    },
    {
      column: 'priority',
      type: 'smallint'
    }
  ],
  relationships: [
    {
      columns: [
        {
          attribute: 'id',
          column: 'owner_id'
        },
        {
          attribute: 'type'
        }
      ],
      name: 'owner'
    }
  ],
  resource: 'widget',
  table: 'widgets'
});

export const mockWrite = () => stub().returns([]);
