using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotificationService.Migrations
{
    /// <inheritdoc />
    public partial class AddInvoiceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Notifications",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BookingDate",
                table: "Notifications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceName",
                table: "Notifications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "BookingDate",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ServiceName",
                table: "Notifications");
        }
    }
}
