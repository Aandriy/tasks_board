﻿// <auto-generated />
using App.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace App.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20180224165335_Initial-3")]
    partial class Initial3
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("App.Areas.Auth.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("Avatar")
                        .HasMaxLength(128);

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(128);

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("App.Models.Board", b =>
                {
                    b.Property<long>("BoardId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("AllowTesting");

                    b.Property<string>("CreateById")
                        .HasMaxLength(450);

                    b.Property<DateTime>("DateOfCreation");

                    b.Property<DateTime>("DateOfModify");

                    b.Property<string>("Description")
                        .HasMaxLength(2560);

                    b.Property<string>("ModifyById")
                        .HasMaxLength(450);

                    b.Property<int>("Priority");

                    b.Property<bool>("Publish");

                    b.Property<string>("Title")
                        .HasMaxLength(256);

                    b.HasKey("BoardId");

                    b.HasIndex("CreateById");

                    b.HasIndex("ModifyById");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("App.Models.Comment", b =>
                {
                    b.Property<long>("CommentId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Body")
                        .IsRequired();

                    b.Property<DateTime>("DateOfCreation");

                    b.Property<DateTime>("DateOfModify");

                    b.Property<long>("GoalId");

                    b.Property<string>("OwnerId")
                        .HasMaxLength(450);

                    b.HasKey("CommentId");

                    b.HasIndex("GoalId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("App.Models.Goal", b =>
                {
                    b.Property<long>("GoalId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AcceptanceCriteria")
                        .IsRequired()
                        .HasMaxLength(10240);

                    b.Property<long>("BoardId");

                    b.Property<bool>("Closed");

                    b.Property<string>("CreateById")
                        .HasMaxLength(450);

                    b.Property<DateTime>("DateOfCreation");

                    b.Property<DateTime>("DateOfModify");

                    b.Property<string>("Details")
                        .HasMaxLength(10240);

                    b.Property<string>("ModifyById")
                        .HasMaxLength(450);

                    b.Property<string>("OwnerId")
                        .IsRequired()
                        .HasMaxLength(450);

                    b.Property<int>("Priority");

                    b.Property<string>("Purpose")
                        .IsRequired()
                        .HasMaxLength(2048);

                    b.Property<int>("Setting");

                    b.Property<int>("Status");

                    b.Property<DateTime>("TimeBound");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.HasKey("GoalId");

                    b.HasIndex("BoardId");

                    b.HasIndex("CreateById");

                    b.HasIndex("ModifyById");

                    b.HasIndex("OwnerId");

                    b.ToTable("Goals");
                });

            modelBuilder.Entity("App.Models.UserBoardAccess", b =>
                {
                    b.Property<long>("BoardId");

                    b.Property<string>("UserId")
                        .HasMaxLength(450);

                    b.Property<bool>("CanAcceptTask");

                    b.Property<bool>("CanCloseTask");

                    b.Property<bool>("CanReadBacklog");

                    b.Property<bool>("CanReadBoard");

                    b.Property<bool>("CanTestTask");

                    b.Property<bool>("CanWriteAccess");

                    b.Property<bool>("CanWriteAllTasks");

                    b.Property<bool>("CanWriteBoard");

                    b.Property<bool>("CanWriteComment");

                    b.Property<bool>("CanWriteTask");

                    b.Property<bool>("CanСhangeBacklog");

                    b.Property<bool>("CanСhangeBoard");

                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("OnlyEditableSection");

                    b.Property<bool>("OnlyMineTasks");

                    b.HasKey("BoardId", "UserId");

                    b.HasAlternateKey("BoardId", "Id", "UserId");

                    b.ToTable("UserBoardAccesses");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("App.Models.Board", b =>
                {
                    b.HasOne("App.Areas.Auth.Models.User", "CreateBy")
                        .WithMany()
                        .HasForeignKey("CreateById");

                    b.HasOne("App.Areas.Auth.Models.User", "ModifyBy")
                        .WithMany()
                        .HasForeignKey("ModifyById");
                });

            modelBuilder.Entity("App.Models.Comment", b =>
                {
                    b.HasOne("App.Models.Goal")
                        .WithMany("Comments")
                        .HasForeignKey("GoalId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("App.Areas.Auth.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");
                });

            modelBuilder.Entity("App.Models.Goal", b =>
                {
                    b.HasOne("App.Models.Board", "Board")
                        .WithMany("Goals")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("App.Areas.Auth.Models.User", "CreateBy")
                        .WithMany()
                        .HasForeignKey("CreateById");

                    b.HasOne("App.Areas.Auth.Models.User", "ModifyBy")
                        .WithMany()
                        .HasForeignKey("ModifyById");

                    b.HasOne("App.Areas.Auth.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("App.Models.UserBoardAccess", b =>
                {
                    b.HasOne("App.Models.Board", "Board")
                        .WithMany()
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("App.Areas.Auth.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("App.Areas.Auth.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("App.Areas.Auth.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("App.Areas.Auth.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
