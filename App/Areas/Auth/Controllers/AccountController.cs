using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Areas.Auth.Models;
using App.Areas.Auth.ViewModels;
using App.Filters;
using App.Helpers;
using App.Interfaces;
using App.Models;
using App.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Areas.Auth.Controllers
{
	[Area("Auth")]
	public class AccountController : Controller
	{
		private readonly UserManager<User> _userManager;
		private readonly ApplicationDbContext _applicationDbContext;
		private readonly IHostingEnvironment _environment;
		private readonly SignInManager<User> _signInManager;
		private readonly IMailService _mailService;

		public AccountController(
			UserManager<User> userManager,
			SignInManager<User> signInManager,
			ApplicationDbContext applicationDbContext,
			IHostingEnvironment environment,
			IMailService mailService
			)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_applicationDbContext = applicationDbContext;
			_environment = environment;
			_mailService = mailService;
		}

		private string UserPhotoFolder => Path.Combine(_environment.WebRootPath, @"img\user");

		public IActionResult UserPhoto(string id)
		{
			var file = System.IO.File.ReadAllBytes(Path.Combine(UserPhotoFolder, id));
			return File(file, $"image/{id.Split('.').Last()}");
		}

		[HttpPost]
		[Authorize]
		[ModelStateValidation]
		public async Task<IActionResult> SaveCoverPicture([FromBody] RequestBase64ImageViewModels data)
		{
			var filePath = UserPhotoFolder;
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _applicationDbContext.Users.FirstOrDefaultAsync(p => p.Id == userId);
			var format = data.DataUrl.Split(';')[0].Split('/')[1];
			var avatar = StrHelper.MD5Encode(data.DataUrl) + "." + format;
			var newPath = Path.Combine(filePath, avatar);
			var oldAvatar = (user.Avatar != null) ? user.Avatar : "";
			var oldPath = Path.Combine(filePath, oldAvatar);
			var base64string = data.DataUrl;
			var filestring = data.DataUrl.Split(',')[1];
			var base64array = Convert.FromBase64String(filestring);
			System.IO.File.WriteAllBytes(newPath, base64array);
			if (newPath != oldPath)
			{
				if (user.Avatar != null && user.Avatar.Length > 3)
				{
					if (System.IO.File.Exists(oldPath))
					{
						System.IO.File.Delete(oldPath);
					}
				}
				user.Avatar = avatar;
				_applicationDbContext.Users.Update(user);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new { });
		}


		[HttpGet]
		[AllowAnonymous]
		public async Task<IActionResult> ConfirmEmail(string userId, string code)
		{
			if (userId == null || code == null)
			{
				return Ok(new { Redirect = "Login" });
			}
			var user = await _userManager.FindByIdAsync(userId);
			if (user == null)
			{
				return NotFound();
			}
			var result = await _userManager.ConfirmEmailAsync(user, code);
			return Redirect("/");
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> Register([FromBody]RegisterViewModel model)
		{
			var errors = new List<InvalidItem>();
			User user = new User
			{
				Email = model.Email,
				UserName = model.Email,
				Avatar = model.Avatar,
				FullName = model.FullName
			};
			// Add User
			var result = await _userManager.CreateAsync(user, model.Password);
			if (result.Succeeded)
			{
				// Email Check

				var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);


				var callbackUrl = Url.Action(
					"ConfirmEmail",
					"Account",
					new
					{
						httproute = "areasApi",
						Area = "Auth",
						userId = user.Id,
						code
					},
					protocol: HttpContext.Request.Scheme
				);
				_mailService.Send(new MailServiceSendModel
				{
					From = "Noreply@gamil.com",
					Receptions = model.Email,
					Subject = "Confirm your account",
					Body = $"Confirm registration by clicking on the <a href='{callbackUrl}'>link</a>"
				});

				// set cookie
				//await _signInManager.SignInAsync(user, false);
				return Ok(new { Redirect = "/EmailConfirmation" });
			}
			else
			{
				errors = AddErrors(result);
			}

			return Ok(new
			{
				Validation = errors
			});
		}


		[HttpPost]
		[ModelStateValidation]
		//[ValidateAntiForgeryToken]
		public async Task<IActionResult> Login([FromBody]LoginViewModel model)
		{

			var user = await _userManager.FindByNameAsync(model.Email);
			var errors = new List<InvalidItem>();
			if (user != null)
			{
				// проверяем, подтвержден ли email
				if (!await _userManager.IsEmailConfirmedAsync(user))
				{
					errors.Add(new InvalidItem
					{
						Message = "You did not verify your email address"
					});
					return Ok(new
					{
						Validation = errors
					});
				}
			}


			var result =
				await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
			if (result.Succeeded)
			{
				// проверяем, принадлежит ли URL приложению
				if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
				{
					return Ok(new
					{
						Redirect = model.ReturnUrl
					});
				}
				else
				{
					return Ok(new { });
				}
			}

			errors.Add(new InvalidItem
			{
				Field = "",
				Message = "Incorrect login and / or password"
			});

			return Ok(new
			{
				Validation = errors
			});
		}

		[HttpPost]
		//[ValidateAntiForgeryToken]
		public async Task<IActionResult> LogOff()
		{
			// remove cookie
			await _signInManager.SignOutAsync();
			return Ok(new { Redirect = "/Login" });
		}


		[HttpPost]
		[AllowAnonymous]
		[ModelStateValidation]
		//[ValidateAntiForgeryToken]
		public async Task<IActionResult> ForgotPassword([FromBody]ForgotPasswordViewModel model)
		{
			var user = await _userManager.FindByNameAsync(model.Email);
			if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
			{

				return Ok(new { Redirect = "/ForgotPasswordConfirmation" });
			}

			var code = await _userManager.GeneratePasswordResetTokenAsync(user);


			var url = HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/ResetPassword/?code=" + WebUtility.UrlEncode(code);

			_mailService.Send(new MailServiceSendModel
			{
				From = "Noreply@gamil.com",
				Receptions = model.Email,
				Subject = "Reset Password",
				Body = $"To reset your password, follow the <a href='{url}'>link</a>"
			});

			return Ok(new { Redirect = "/ForgotPasswordConfirmation" });
		}


		[HttpPost]
		[AllowAnonymous]
		[ModelStateValidation]
		//[ValidateAntiForgeryToken]
		public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordViewModel model)
		{

			var user = await _userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				// Don't reveal that the user does not exist
				return Ok(new { Redirect = "/ResetPasswordConfirmation" });
			}
			var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
			if (result.Succeeded)
			{
				return Ok(new { Redirect = "/ResetPasswordConfirmation" });
			}
			var errors = AddErrors(result);

			return Ok(new { Validation = errors });
		}
			
		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> SetUserData([FromBody]UserDataViewModels model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var user = await _applicationDbContext.Users.Where(t => t.Id == userId && t.EmailConfirmed).FirstOrDefaultAsync();
			if (user == null)
			{
				return NotFound();
			}
			user.FullName = model.FullName;
			_applicationDbContext.Users.Update(user);
			await _applicationDbContext.SaveChangesAsync();
			return Ok(new { });
		}


		private List<InvalidItem> AddErrors(IdentityResult result)
		{
			var errors = new List<InvalidItem>();
			foreach (var error in result.Errors)
			{
				errors.Add(new InvalidItem
				{
					Field = "",
					Message = error.Description
				});
			}
			return errors;
		}
		private Task<User> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);
	}
}