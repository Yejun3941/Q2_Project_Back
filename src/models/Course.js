const Sequelize = require("sequelize");

class Course extends Sequelize.Model {
  static initiate(sequelize) {
    Course.init(
      {
        title: {
          type: Sequelize.STRING(12),
          allowNull: true,
          unique: true,
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: true,
          unique: true,
        },
        meanStartPoint: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          unique: false,
          defaultValue: 0,
        },
        countStarPoint: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Course",
        tableName: "course",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        indexes: [
          {
            fields: ["meanStartPoint"],
          },
        ],
      }
    );
  }

  static associate(db) {
    db.Course.belongsTo(db.User, {
      as: "Writer",
      foreignKey: "F_User_id",
    });
    db.Course.belongsTo(db.Location, {
      as: "Location",
      foreignKey: "F_Course_Location",
    });
    db.Course.hasMany(db.Link, { foreignKey: "F_Course_id" });
    db.Course.hasMany(db.CourseComment, { foreignKey: "F_Course_id" });
  }
}

module.exports = Course;
