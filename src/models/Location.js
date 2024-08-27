const Sequelize = require("sequelize");

class Location extends Sequelize.Model {
  static initiate(sequelize) {
    Location.init(
      {
        name: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Location",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Location.belongsTo(db.User, {
      as: "Writer",
      foreignKey: "F_User_id",
    });
    db.Location.belongsTo(db.Location, {
      as: "Location",
      foreignKey: "F_User_Location",
    });
    db.Location.hasMany(db.Spot, { foreignKey: "F_Spot_Location" });
    db.Location.hasMany(db.Course, { foreignKey: "F_Course_Location" });
  }
}

module.exports = Location;
