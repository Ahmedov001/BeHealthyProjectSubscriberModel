using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class newSubscribe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Subscribers_SubscriberId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SubscriberId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SubscriberId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "Plan",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubscriberId",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers",
                column: "DietitianId",
                unique: true,
                filter: "[DietitianId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "Plan",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "SubscriberId",
                table: "Subscribers");

            migrationBuilder.AddColumn<string>(
                name: "SubscriberId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers",
                column: "DietitianId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SubscriberId",
                table: "AspNetUsers",
                column: "SubscriberId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Subscribers_SubscriberId",
                table: "AspNetUsers",
                column: "SubscriberId",
                principalTable: "Subscribers",
                principalColumn: "Id");
        }
    }
}
