using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class Subscriber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubscriberId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subscribers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DietitianId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscribers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscribers_AspNetUsers_DietitianId",
                        column: x => x.DietitianId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SubscriberId",
                table: "AspNetUsers",
                column: "SubscriberId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_DietitianId",
                table: "Subscribers",
                column: "DietitianId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Subscribers_SubscriberId",
                table: "AspNetUsers",
                column: "SubscriberId",
                principalTable: "Subscribers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Subscribers_SubscriberId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SubscriberId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SubscriberId",
                table: "AspNetUsers");
        }
    }
}
