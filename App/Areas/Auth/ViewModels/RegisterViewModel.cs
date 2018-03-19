using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace App.Areas.Auth.ViewModels
{
    public class RegisterViewModel
	{
		[Required]
		[EmailAddress]
		[Display(Name = "Email")]
		public string Email { get; set; }

		[StringLength(128)]
		public string Avatar { get; set; }

		[Required]
		[StringLength(128)]
		public string FullName { get; set; }

		[Required]
		[DataType(DataType.Password)]
		public string Password { get; set; }

		[Required]
		[Compare("Password", ErrorMessage = "Passwords do not match please retype")]
		[DataType(DataType.Password)]
		public string PasswordConfirm { get; set; }
	}
}
