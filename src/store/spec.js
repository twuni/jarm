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
  });

  describe('#retrieveResource()', () => {
    it('retrieves the resource with the appropriate query', async () => {
      const schema = mockSchema();
      const read = mockRead();
      const resourceIdentifier = mockResourceIdentifier();

      await new Store(schema).retrieveResource(resourceIdentifier)(read);

      expect(read).to.have.been.calledWith('SELECT id, favorite_color, priority FROM widgets WHERE id = $1');
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

      expect(write).to.have.been.calledWith('UPDATE r_widgets_owner SET owner_id = $2, related_type = $3 WHERE id = $1');
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
