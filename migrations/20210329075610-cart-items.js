'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable("cart_items", {
        id: {
            "type": "int",
            "unsigned": true,
            "primaryKey": true,
            "autoIncrement": true
        },
        quantity: {
            "type": "int",
            "unsigned": true
        },
        poster_id: {
            "type": "int",
            "notNull": true,
            "foreignKey": {
                "name": "cart_items_posters_fk",
                "table": "posters",
                "mapping": "id",
                "rules": {
                    "onDelete": "CASCADE",
                    "onUpdate": "RESTRICT"
                }
            }
        },
        user_id: {
            "type": "int",
            "notNull": true,
            "foreignKey": {
                "name": "cart_items_users_fk",
                "table": "users",
                "mapping": "id",
                "rules": {
                    "onDelete": "CASCADE",
                    "onUpdate": "RESTRICT"
                }
            }
        }

    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
