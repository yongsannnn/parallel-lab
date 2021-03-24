'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


exports.up = function (db) {
    return db.createTable("genres_posters", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        poster_id: {
            type: "int",
            notNull: true,
            foreignKey: {
                name: "poster_tag_fk",
                table: "posters",
                mapping: "id",
                rules: {
                    onDelete: "cascade",
                    onUpdate: "restrict"
                }
            }
        },
        genre_id: {
            type: "int",
            notNull: true,
            foreignKey: {
                name: "genre_product_fk",
                table: "genres",
                mapping: "id",
                rules: {
                    onDelete: "cascade",
                    onUpdate: "restrict"
                }
            }
        }
    });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
