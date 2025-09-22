using Microsoft.AspNetCore.Mvc;
using TasklyApi.Services;

namespace TasklyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest req)
        {
            var success = await _authService.RegisterAsync(req.Username, req.Password);
            if (!success) return BadRequest("Username already exists");
            return Ok("Signup successful");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var token = await _authService.LoginAsync(req.Username, req.Password);
            if (token == null) return Unauthorized("Invalid credentials");
            return Ok(new { token });
        }
    }

    public class SignupRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
