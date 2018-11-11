# Jarm is JSON-API Relational Mapping

Define a schema for your JSON API resources and your relational database... at the same time!

Pairs nicely with [@twuni/pg][3].

## Installing

### NPM

```
$ npm install jarm
```

### Yarn

```
$ yarn add jarm
```

## Usage

```javascript
import { Pool } from 'pg';
import PostgreSQL from '@twuni/pg';
import { Store } from 'jarm';

const schema = {
  columns: [
    {
      attribute: 'favoriteColor',
      column: 'favorite_color',
      type: 'text'
    }
  ],
  id: {
    column: 'id',
    type: 'text'
  },
  relationships: [
    {
      columns: [
        {
          attribute: 'id',
          column: 'related_id',
          type: 'text'
        },
        {
          attribute: 'type',
          column: 'related_type',
          type: 'text'
        }
      ],
      name: 'owner',
      table: 'r_widgets_owner'
    }
  ],
  resource: 'widget',
  table: 'widgets'
};

const store = new Store(schema);

new PostgreSQL().connect().then(({ disconnect, write }) => {
  write(async (query) => {
    await store.createSchema()(query);

    const resource = {
      attributes: {
        favoriteColor: 'blue'
      },
      id: 'Cba...987',
      relationships: {
        owner: {
          data: {
            id: 'Abc...789',
            type: 'user'
          }
        }
      },
      type: 'widget'
    };

    await store.createResource(resource)(query);
  });
});
```

[3]: https://github.com/twuni/pg.js
