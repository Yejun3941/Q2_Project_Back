const Sequelize = require("sequelize");

class Link extends Sequelize.Model {
  static initiate(sequelize) {
    Link.init(
      {},
      {
        sequelize,
        modelName: "Link",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Link.belongsTo(db.Course, { foreignKey: "F_course_id" });
    db.Link.belongsTo(db.Spot, { foreignKey: "F_spot_id" });
  }
}

module.exports = Link;
