using System;
using System.ComponentModel.DataAnnotations;

namespace App.Areas.Auth.ViewModels
{
	public class UserDataViewModels
	{
		[Required]
		public string FullName { get; set; }
	}
}
