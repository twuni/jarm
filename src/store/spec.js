import { describe, expect, it } from '../spec.helpers';
import { mockRead, mockResource, mockResourceIdentifier, mockSchema, mockWrite } from './spec.mocks';

import Store from '.';

describe('Store', () => {
  describe('#createResource()', () => {
    it('creates the resource with the appropriate query', async () => {
      const schema = mockSchema();
      const resource = mockResource();
      const write = mockWrite();

      await new Store(schema).createResource(resource)(write);

      expect(write).to.have.been.calledWith('INSERT INTO widgets (id, favorite_color, priority) VALUES ($1, $2, $3)');
    });

    it('creates a relationship with the appropriate query', async () => {
      const schema = mockSchema();
      const resource = mockResource();
      const write = mockWrite();

      await new Store(schema).createResource(resource)(write);

      expect(write).to.have.been.calledWith('INSERT INTO r_widgets_owner (id, owner_id, related_type) VALUES ($1, $2, $3)');
    });

    it('does not attempt to create a relationship if not specified on the resource', async () => {
      const schema = mockSchema();
      const resource = mockResource({ relationships: {} });
      const write = mockWrite();

      await new Store(schema).createResource(resource)(write);

      expect(write).not.to.have.been.calledWith('INSERT INTO r_widgets_owner (id, owner_id, related_type) VALUES ($1, $2, $3)');
    });
  });

  describe('#createSchema()', () => {
    it('creates the resource table with the appropriate query', async () => {
      const schema = mockSchema();
      const write = mockWrite();

      await new Store(schema).createSchema()(write);

      expect(write).to.have.been.calledWith('CREATE TABLE IF NOT EXISTS widgets (id text NOT NULL, favorite_color text, priority smallint, PRIMARY KEY (id))');
    });

    it('creates a relationship table with the appropriate query', async () => {
      const schema = mockSchema();
      const write = mockWrite();

      await new Store(schema).createSchema()(write);

      expect(write).to.have.been.calledWith('CREATE TABLE IF NOT EXISTS r_widgets_owner (id text NOT NULL REFERENCES widgets (id), owner_id text, related_type text, PRIMARY KEY (id))');
    });
  });

  describe('#destroyResource()', () => {
    it('destroys the resource with the appropriate query', async () => {
      const schema = mockSchema();
      const resourceIdentifier = mockResourceIdentifier();
      const write = mockWrite();

      await new Store(schema).destroyResource(resourceIdentifier)(write);

      expect(write).to.have.been.calledWith('DELETE FROM widgets WHERE id = $1');
    });

    it('destroys a relationship with the appropriate query', async () => {
      const schema = mockSchema();
      const resourceIdentifier = mockResourceIdentifier();
      const write = mockWrite();

      await new Store(schema).destroyResource(resourceIdentifier)(write);

      expect(write).to.have.been.calledWith('DELETE FROM r_widgets_owner WHERE id = $1');
    });
  });

  describe('#listResources()', () => {
    it('lists resources with the appropriate query', async () => {
      const schema = mockSchema();
      const read = mockRead();

      await new Store(schema).listResources()(read);

      expect(read).to.have.been.calledWith('SELECT id, favorite_color, priority FROM widgets');
    });

    it('lists resources matching a specified attribute', async () => {
      const schema = mockSchema();
      const read = mockRead();

      await new Store(schema).listResources({
        attributes: {
          priority: 123
        }
      })(read);

      expect(read).to.have.been.calledWith('SELECT id, favorite_color, priority FROM widgets WHERE priority = $1');
    });

    it('lists resources matching a specified relationship', async () => {
      const schema = mockSchema();
      const read = mockRead();

      await new Store(schema).listResources({
        relationships: {
          owner: {
            data: {
              id: '<UserId>',
              type: 'user'
            }
          }
        }
      })(read);

      expect(read).to.have.been.calledWith('SELECT widgets.id AS id, widgets.favorite_color AS favorite_color, widgets.priority AS priority FROM widgets INNER JOIN r_widgets_owner ON widgets.id = r_widgets_owner.id WHERE r_widgets_owner.owner_id = $1 AND r_widgets_owner.related_type = $2');
    });
  });

  describe('#retrieveResource()', () => {
    it('retrieves the resource with the appropriate query', async () => {
      const schema = mockSchema();
      const read = mockRead();
      const resourceIdentifier = mockResourceIdentifier();

      await new Store(schema).retrieveResource(resourceIdentifier)(read);

      expect(read).to.have.been.calledWith('SELECT id, favorite_color, priority FROM widgets WHERE id = $1');
    });

    it('retrieves related resources with the appropriate query', async () => {
      const schema = mockSchema();
      const read = mockRead();
      const resourceIdentifier = mockResourceIdentifier();

      await new Store(schema).retrieveResource(resourceIdentifier)(read);

      expect(read).to.have.been.calledWith('SELECT owner_id, related_type FROM r_widgets_owner WHERE id = $1');
    });

    it('includes all related resources of a single named relationship', async () => {
      const schema = mockSchema();
      const read = mockRead();
      const resourceIdentifier = mockResourceIdentifier();

      read.withArgs('SELECT owner_id, related_type FROM r_widgets_owner WHERE id = $1').returns([
        // eslint-disable-next-line camelcase
        { owner_id: '<UserId:Alice>', related_type: 'user' },
        // eslint-disable-next-line camelcase
        { owner_id: '<UserId:Bob>', related_type: 'user' }
      ]);

      const resource = await new Store(schema).retrieveResource(resourceIdentifier)(read);

      expect(resource).to.have.nested.property('relationships.owner.data[0].id', '<UserId:Alice>');
      expect(resource).to.have.nested.property('relationships.owner.data[1].id', '<UserId:Bob>');
    });
  });

  describe('#updateResource()', () => {
    it('updates the resource with the appropriate query', async () => {
      const schema = mockSchema();
      const resource = mockResource();
      const write = mockWrite();

      await new Store(schema).updateResource(resource)(write);

      expect(write).to.have.been.calledWith('UPDATE widgets SET favorite_color = $2, priority = $3 WHERE id = $1');
    });

    it('updates a relationship with the appropriate query', async () => {
      const schema = mockSchema();
      const resource = mockResource();
      const write = mockWrite();

      await new Store(schema).updateResource(resource)(write);

      expect(write).to.have.been.calledWith('INSERT INTO r_widgets_owner (id, owner_id, related_type) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id, related_type = EXCLUDED.related_type');
    });

    it('does not attempt to update a relationship if not specified on the resource', async () => {
      const schema = mockSchema();
      const resource = mockResource({ relationships: {} });
      const write = mockWrite();

      await new Store(schema).updateResource(resource)(write);

      expect(write).not.to.have.been.calledWith('UPDATE r_widgets_owner SET owner_id = $2, related_type = $3 WHERE id = $1');
    });
  });
});
