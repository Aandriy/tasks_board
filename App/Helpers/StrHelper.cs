using System;
using System.Security.Cryptography;
using System.Text;

namespace App.Helpers
{
	public class StrHelper
	{
		public static string MD5Encode(string str)
		{
			Byte[] originalBytes;
			Byte[] encodedBytes;
			MD5 md5;

			// Conver the original password to bytes; then create the hash
			md5 = new MD5CryptoServiceProvider();
			originalBytes = ASCIIEncoding.Default.GetBytes(str);
			encodedBytes = md5.ComputeHash(originalBytes);

			// Bytes to string
			return System.Text.RegularExpressions.Regex.Replace(BitConverter.ToString(encodedBytes), "-", "").ToLower();
		}

		public static string ToCamelCase(string value)
		{
			if (string.IsNullOrEmpty(value))
			{
				return string.Empty;
			}

			return value[0].ToString().ToLower() + value.Substring(1);
		}
	}
}
