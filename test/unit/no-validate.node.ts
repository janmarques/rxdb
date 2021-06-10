import assert from 'assert';
import config from './config';

import {
    addRxPlugin,
    createRxDatabase,
    randomCouchString,
    addPouchPlugin,
    getRxStoragePouch
} from '../../plugins/core';
addRxPlugin(require('../../plugins/no-validate'));
addPouchPlugin(require('pouchdb-adapter-memory'));

const schema = {
    title: 'human schema',
    description: 'describes a human being',
    version: 0,
    keyCompression: false,
    type: 'object',
    properties: {
        passportId: {
            type: 'string'
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        }
    },
    indexes: ['passportId'],
    required: ['firstName', 'lastName']
};

config.parallel('no-validate.node.js', () => {
    it('should allow to insert everything', async () => {
        const db = await createRxDatabase({
            name: randomCouchString(10),
            storage: getRxStoragePouch('memory'),
        });
        const col = await db.collection({
            name: 'humans',
            schema
        });
        await col.insert({
            foo: 'bar'
        });
        db.destroy();
    });
    it('should allow to save everything', async () => {
        const db = await createRxDatabase({
            name: randomCouchString(10),
            storage: getRxStoragePouch('memory'),
        });
        const col = await db.collection({
            name: 'humans',
            schema
        });
        await col.insert({
            foo: 'bar'
        });
        const doc = await col.findOne().exec();
        assert.strictEqual(doc.get('foo'), 'bar');

        await doc.atomicSet('bar', 'foo');
        db.destroy();
    });
});
