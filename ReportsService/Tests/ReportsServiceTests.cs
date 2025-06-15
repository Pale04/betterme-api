using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Tests.Helpers;
using Microsoft.AspNetCore.Authentication;
using Service.DTO;

namespace Tests;

public class ReportsServiceTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly TestWebApplicationFactory<Program> _factory;
    private readonly HttpClient _memberAuthClient;
    private readonly HttpClient _moderatorAuthClient;

    public ReportsServiceTests(TestWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _memberAuthClient = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddAuthentication(defaultScheme: "TestMemberScheme")
                    .AddScheme<AuthenticationSchemeOptions, TestMemberAuthHandler>("TestMemberScheme", options => { });
            });
        }).CreateClient();
        _moderatorAuthClient = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddAuthentication(defaultScheme: "TestModeratorScheme")
                    .AddScheme<AuthenticationSchemeOptions, TestModeratorAuthHandler>("TestModeratorScheme", options => { });
            });
        }).CreateClient();
    }

    [Fact]
    [Trait("Category", "Authentication")]
    public async Task PostReportWithInvalidAuthorization()
    {
        var response = await _moderatorAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Authentication")]
    public async Task GetReportWithInvalidAuthorization()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _memberAuthClient.GetAsync($"/reports/{addedReport?.Id}");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Authentication")]
    public async Task PatchReportWithInvalidAuthorization()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _memberAuthClient.PatchAsJsonAsync($"/reports/{addedReport?.Id}", new { ok = true });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostReportSuccessfulTest()
    {
        var response = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostReportWithEmptyFieldsTest()
    {
        var response = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "",
            Reason = ""
        });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostReportWithInvalidRoleTest()
    {
        var response = await _moderatorAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetReportWithIdSuccessfulTest()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD123456",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _moderatorAuthClient.GetAsync($"/reports/{addedReport?.Id}");
        var foundReport = await response.Content.ReadFromJsonAsync<ReportDTO>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(addedReport?.Id, foundReport?.Id);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetReportWithoutIdSuccesfulTest()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _moderatorAuthClient.GetAsync($"/reports");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetReportNotFoundTest()
    {
        var response = await _moderatorAuthClient.GetAsync($"/reports/683b8c92d01ece46c95e52d4");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchReportSuccessfulTest()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _moderatorAuthClient.PatchAsJsonAsync($"/reports/{addedReport?.Id}", new { ok = true });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchReportNoRequiredBodyTest()
    {
        var postResponse = await _memberAuthClient.PostAsJsonAsync("/reports", new
        {
            PostId = "ABCD1234",
            Reason = "Violence"
        });
        var addedReport = await postResponse.Content.ReadFromJsonAsync<ReportDTO>();

        var response = await _moderatorAuthClient.PatchAsJsonAsync($"/reports/{addedReport?.Id}", new {  });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
    
    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchReportNotFoundTest()
    {
        var response = await _moderatorAuthClient.PatchAsJsonAsync("/reports/683b8c92d01ece46c95e52d4", new { ok = true });
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}