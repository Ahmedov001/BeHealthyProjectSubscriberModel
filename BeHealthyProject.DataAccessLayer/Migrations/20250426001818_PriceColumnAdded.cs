using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeHealthyProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class PriceColumnAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "AspNetUsers",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "AspNetUsers");
        }
    }
}
