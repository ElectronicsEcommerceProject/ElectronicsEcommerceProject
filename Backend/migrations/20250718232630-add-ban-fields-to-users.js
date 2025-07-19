export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "ban_reason", {
    type: Sequelize.TEXT,
    allowNull: true,
  });

  await queryInterface.addColumn("Users", "admin_notes", {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Users", "ban_reason");
  await queryInterface.removeColumn("Users", "admin_notes");
}