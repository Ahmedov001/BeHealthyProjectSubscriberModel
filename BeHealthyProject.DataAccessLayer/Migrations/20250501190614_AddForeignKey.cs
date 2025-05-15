using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms");

            migrationBuilder.AlterColumn<string>(
                name: "DietitianId",
                table: "DietPrograms",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms",
                column: "DietitianId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms");

            migrationBuilder.AlterColumn<string>(
                name: "DietitianId",
                table: "DietPrograms",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_DietPrograms_AspNetUsers_DietitianId",
                table: "DietPrograms",
                column: "DietitianId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
