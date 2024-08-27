const Sequelize = require("sequelize");

class FavoritSpot extends Sequelize.Model {
  static initiate(sequelize) {
    FavoritSpot.init(
      {
        check: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "FavoritSpot",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.FavoritSpot.belongsTo(db.User, { foreignKey: "F_user_id" });
    db.FavoritSpot.belongsTo(db.Spot, { foreignKey: "F_spot_id" });
  }
}

module.exports = FavoritSpot;
