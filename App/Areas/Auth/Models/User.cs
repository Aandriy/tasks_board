using App.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace App.Areas.Auth.Models
{
	public class User : IdentityUser
	{
		[StringLength(128)]
		public string Avatar { get; set; }
		[Required]
		[StringLength(128)]
		public string FullName { get; set; }
		
	}
}
