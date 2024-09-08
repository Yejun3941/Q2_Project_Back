const Sequelize = require("sequelize");

class Spot extends Sequelize.Model {
  static initiate(sequelize) {
    Spot.init(
      {
        Lat: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        Lng: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        Spot_Name: {
          type: Sequelize.STRING(12),
          allowNull: false,
        },
        Category: {
          type: Sequelize.ENUM("맛집", "카페", "산책", "문화", "체험"),
          allowNull: true,
        },
        Photo: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Spot",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        indexes: [
          {
            fields: ["Category"],
            using: "BTREE",
          },
        ],
      }
    );
  }

  static associate(db) {
    db.Spot.belongsTo(db.Location, {
      as: "Location",
      foreignKey: "F_Spot_Location",
    });
    db.Spot.hasMany(db.Link, { foreignKey: "F_Spot_id" });
  }
}

module.exports = Spot;
