using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class createdietprogram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DietitianId",
                table: "DietPrograms",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DietPrograms_DietitianId",
                table: "DietPrograms",
                column: "DietitianId");

            migrationBuilder.AddForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms",
                column: "DietitianId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms");

            migrationBuilder.DropIndex(
                name: "IX_DietPrograms_DietitianId",
                table: "DietPrograms");

            migrationBuilder.DropColumn(
                name: "DietitianId",
                table: "DietPrograms");
        }
    }
}
