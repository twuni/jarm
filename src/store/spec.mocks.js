import { stub } from '../spec.helpers';

export const mockRead = () => stub().returns([
  {
    // eslint-disable-next-line camelcase
    favorite_color: 'blue',
    id: '<RecordId>',
    // eslint-disable-next-line camelcase
    is_friendly: 1,
    priority: 123
  }
]);

export const mockResource = ({ attributes, id, relationships, type } = {}) => ({
  attributes: attributes || {
    favoriteColor: 'yellow',
    isFriendly: true,
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
      attribute: 'isFriendly',
      column: 'is_friendly',
      type: 'smallint'
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
    },
    {
      columns: [
        {
          attribute: 'id'
        },
        {
          attribute: 'type'
        }
      ],
      name: 'friend'
    }
  ],
  resource: 'widget',
  table: 'widgets'
});

export const mockWrite = () => stub().returns([]);
