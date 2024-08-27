const Sequelize = require("sequelize");

class FavoritCourse extends Sequelize.Model {
  static initiate(sequelize) {
    FavoritCourse.init(
      {
        check: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "FavoritCourse",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.FavoritCourse.belongsTo(db.User, { foreignKey: "F_user_id" });
    db.FavoritCourse.belongsTo(db.Course, { foreignKey: "F_course_id" });
  }
}

module.exports = FavoritCourse;
