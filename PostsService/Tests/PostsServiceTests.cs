using System.Net;
using System.Net.Http.Json;
using Tests.Helpers;

namespace Tests;

public class ReportsServiceTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly string _userId;
    private readonly string _postId;

    public ReportsServiceTests(TestWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
        _userId = "684e1395141f0c04e9d69d44";
        _postId = "684e1395141f0c04e9d69d44";
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPotsByCategorySuccesfulTest()
    {
        var result = await _client.GetAsync("/posts?category=Workout");
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPostsByCategoryNonExistentCategoryTest()
    {
        var result = await _client.GetAsync("/posts?category=Happiness");
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPostsByUserSuccessfulTest()
    {
        var result = await _client.GetAsync($"/posts/user/{_userId}");
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPostsByUserNonExistentUserTest()
    {
        var result = await _client.GetAsync($"/posts/user/684e13afdc53ae66bd30092a");
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPostByIdSuccessfulTest()
    {
        var result = await _client.GetAsync($"/posts/{_postId}");
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Get")]
    public async Task GetPostByIdNonExistenTest()
    {
        var result = await _client.GetAsync("/posts/684e13afdc53ae66bd30092a");
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchPostSuccessfulTest()
    {
        var result = await _client.PatchAsJsonAsync($"/posts/{_postId}/status", new { State = "Reported" });
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchPostWithoutBodyTest()
    {
        var result = await _client.PatchAsJsonAsync($"/posts/{_postId}/status", new { });
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchPostInvalidIdTest()
    {
        var result = await _client.PatchAsJsonAsync("/posts/ /status", new { State = "Reported" });
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchPostNonExistentTest()
    {
        var result = await _client.PatchAsJsonAsync("/posts/684e13afdc53ae66bd30092a/status", new { State = "Reported" });
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Patch")]
    public async Task PatchPostInvalidStateTest()
    {
        var result = await _client.PatchAsJsonAsync($"/posts/{_postId}/status", new { State = "Changed" });
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Delete")]
    public async Task DeletePostSuccessfulTest()
    {
        var result = await _client.DeleteAsync($"/posts/{_postId}");
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }

    [Fact]
    [Trait("Category", "Delete")]
    public async Task DeletePostNonExistenTest()
    {
        var result = await _client.DeleteAsync("/posts/684e13afdc53ae66bd30092a");
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }
}