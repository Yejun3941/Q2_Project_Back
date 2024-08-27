const Sequelize = require("sequelize");

class CourseComment extends Sequelize.Model {
  static initiate(sequelize) {
    CourseComment.init(
      {
        comment_content: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        starPoint: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "CourseComment",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.CourseComment.belongsTo(db.Course, { foreignKey: "F_Course_id" });
    db.CourseComment.belongsTo(db.User, { foreignKey: "F_User_id" });
  }
}

module.exports = CourseComment;
