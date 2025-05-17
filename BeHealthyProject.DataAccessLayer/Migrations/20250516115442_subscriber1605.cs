using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class subscriber1605 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Subscribers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers",
                column: "DietitianId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_UserId",
                table: "Subscribers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Subscribers_AspNetUsers_UserId",
                table: "Subscribers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subscribers_AspNetUsers_UserId",
                table: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_Subscribers_UserId",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Subscribers");

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers",
                column: "DietitianId",
                unique: true,
                filter: "[DietitianId] IS NOT NULL");
        }
    }
}
