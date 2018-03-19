using App.Areas.Auth.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace App.Models
{
	public class ApplicationDbContext : IdentityDbContext<User>
	{
		public DbSet<Board> Boards { get; set; }
		public DbSet<Goal> Goals { get; set; }
		public DbSet<UserBoardAccess> UserBoardAccesses { get; set; }
		public DbSet<Comment> Comments { get; set; }


		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.Entity<UserBoardAccess>()
				.HasKey(t => new { t.BoardId, t.UserId });
		}
	}
}
