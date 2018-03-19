using App.Areas.Auth.Models;
using App.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace App.Controllers
{
	public class HomeController : Controller
	{
		private readonly UserManager<User> _userManager;

		public HomeController(UserManager<User> userManager)
		{
			_userManager = userManager;
		}

		[HttpPost]
		public async Task<IActionResult> GetCurrentUser()
		{
			var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var model = new CurrentUserViewModel();
			if (id != null) {
				var user = await _userManager.FindByIdAsync(id);
				if (user != null)
				{
					model.Name = user.FullName;
					model.Avatar = user.Avatar;
				}
			}
			
			return Ok(new { User = model });
		}
	}
}