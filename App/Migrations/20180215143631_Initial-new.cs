using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace App.Migrations
{
    public partial class Initialnew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaskWrite",
                table: "UserBoardAccesses",
                newName: "CanСhangeBoard");

            migrationBuilder.RenameColumn(
                name: "CommentWrite",
                table: "UserBoardAccesses",
                newName: "CanСhangeBacklog");

            migrationBuilder.RenameColumn(
                name: "CanTaskClose",
                table: "UserBoardAccesses",
                newName: "CanWriteTask");

            migrationBuilder.RenameColumn(
                name: "CanTaskAccept",
                table: "UserBoardAccesses",
                newName: "CanWriteComment");

            migrationBuilder.RenameColumn(
                name: "BoardWrite",
                table: "UserBoardAccesses",
                newName: "CanWriteBoard");

            migrationBuilder.RenameColumn(
                name: "BoardRead",
                table: "UserBoardAccesses",
                newName: "CanWriteAccess");

            migrationBuilder.RenameColumn(
                name: "AccessWrite",
                table: "UserBoardAccesses",
                newName: "CanReadBoard");

            migrationBuilder.AddColumn<bool>(
                name: "CanAcceptTask",
                table: "UserBoardAccesses",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanCloseTask",
                table: "UserBoardAccesses",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanReadBacklog",
                table: "UserBoardAccesses",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanAcceptTask",
                table: "UserBoardAccesses");

            migrationBuilder.DropColumn(
                name: "CanCloseTask",
                table: "UserBoardAccesses");

            migrationBuilder.DropColumn(
                name: "CanReadBacklog",
                table: "UserBoardAccesses");

            migrationBuilder.RenameColumn(
                name: "CanСhangeBoard",
                table: "UserBoardAccesses",
                newName: "TaskWrite");

            migrationBuilder.RenameColumn(
                name: "CanСhangeBacklog",
                table: "UserBoardAccesses",
                newName: "CommentWrite");

            migrationBuilder.RenameColumn(
                name: "CanWriteTask",
                table: "UserBoardAccesses",
                newName: "CanTaskClose");

            migrationBuilder.RenameColumn(
                name: "CanWriteComment",
                table: "UserBoardAccesses",
                newName: "CanTaskAccept");

            migrationBuilder.RenameColumn(
                name: "CanWriteBoard",
                table: "UserBoardAccesses",
                newName: "BoardWrite");

            migrationBuilder.RenameColumn(
                name: "CanWriteAccess",
                table: "UserBoardAccesses",
                newName: "BoardRead");

            migrationBuilder.RenameColumn(
                name: "CanReadBoard",
                table: "UserBoardAccesses",
                newName: "AccessWrite");
        }
    }
}
