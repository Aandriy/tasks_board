using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace App.Areas.Auth.ViewModels
{
    public class RequestBase64ImageViewModels
    {
		[Required]
		public string DataUrl { get; set; }
	}
}
