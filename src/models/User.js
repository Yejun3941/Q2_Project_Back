const Sequelize = require("sequelize");
class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        nickname: {
          type: Sequelize.STRING(12),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(256),
          allowNull: true,
          defaultValue: null,
        },
        provider: {
          type: Sequelize.ENUM("naver", "kakao", "local", "google"),
          allowNull: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Course, { foreignKey: "F_User_id" });
    db.User.hasMany(db.FavoritSpot, { foreignKey: "F_User_id" });
    db.User.hasMany(db.FavoritCourse, { foreignKey: "F_User_id" });
    db.User.hasMany(db.CourseComment, { foreignKey: "F_User_id" });
  }
}

module.exports = User;
