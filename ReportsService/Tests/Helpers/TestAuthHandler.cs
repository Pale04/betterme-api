using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;

using Tests.Helpers;

public class TestMemberAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestMemberAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Role, "Member")
        };
        var identity = new ClaimsIdentity(claims, "TestMember");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestMemberScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public class TestModeratorAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestModeratorAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Role, "Moderator")
        };
        var identity = new ClaimsIdentity(claims, "TestModerator");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestModeratorScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public class TestFailedAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestFailedAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        return Task.FromResult(AuthenticateResult.Fail("Invalid test token"));
    }
}