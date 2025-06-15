using System.Net;
using System.Net.Http.Json;
using Tests.Helpers;
using HealthStatsService.Models;

namespace Tests;

public class HealthStatsServiceTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly string _userId;

    public HealthStatsServiceTests(TestWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
        _userId = "ABCD1234";
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostHealthStatsSuccessfulTest()
    {
        var response = await _client.PostAsJsonAsync("/healthstats", new
        {
            UserId = _userId,
            Arms = 24.1,
            Height = 170,
            Mood = 1,
            SleepHours = 6,
            Waist = 20.2,
            Weight = 62.5,
            WaterIntake = 8,
            Date = DateTime.UtcNow,
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostHealthStatsWithoutUserId()
    {
        var response = await _client.PostAsJsonAsync("/healthstats", new
        {
            Arms = 24.1,
            Height = 170,
            Mood = 1,
            SleepHours = 6,
            Waist = 20.2,
            Weight = 62.5,
            WaterIntake = 8,
            Date = DateTime.UtcNow,
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostHealthStatsWithoutDateTest()
    {
        var response = await _client.PostAsJsonAsync("/healthstats", new
        {
            UserId = _userId,
            Arms = 24.1,
            Height = 170,
            Mood = 1,
            SleepHours = 6,
            Waist = 20.2,
            Weight = 62.5,
            WaterIntake = 8
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostHealtStatsWithoutBodyTest()
    {
        var response = await _client.PostAsJsonAsync("/healthstats", new { });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Post")]
    public async Task PostHealthStatsDuplicatedTest()
    {
        var response = await _client.PostAsJsonAsync("/healthstats", new
        {
            Id = "684e1395141f0c04e9d69d44",
            UserId = _userId,
            Arms = 24.1,
            Height = 170,
            Mood = 1,
            SleepHours = 6,
            Waist = 20.2,
            Weight = 62.5,
            WaterIntake = 8,
            Date = DateTime.UtcNow,
        });

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
    }


    [Fact]
    [Trait("Category", "Get")]
    public async Task GetHealthStatsSuccessfulTest()
    {
        var response = await _client.GetAsync($"/healthstats/{_userId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetHealthStatsNonExistenUserTest()
    {
        var response = await _client.GetAsync($"/healthstats/{_userId + "1"}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}