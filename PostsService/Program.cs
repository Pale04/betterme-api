using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using PostsService.Models;
using PostsService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings")
);

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");

//GET /posts?category={Category}
app.MapGet("/posts", async ([FromServices] MongoDbContext dbContext, [FromQuery] Category? category) =>
{
    var filterBuilder = Builders<Post>.Filter;
    var timeFilter = filterBuilder.Empty;

    var statusFilter = filterBuilder.In(p => p.Status, new[] { Status.Published, Status.Reported });

    FilterDefinition<Post> categoryFilter = filterBuilder.Empty;
    if (category.HasValue)
    {
        categoryFilter = filterBuilder.Eq(p => p.Category, category.Value);
    }

    var combined = filterBuilder.And(statusFilter, categoryFilter);

    var posts = await dbContext.PostsCollection
        .Find(combined)
        .SortByDescending(p => p.Timestamp)
        .Limit(20)
        .ToListAsync();

    return Results.Ok(posts);
})
.WithSummary("Get a list of the newest posts by category")
.Produces(200)
.Produces(500);

//GET /posts/user/{userId}
app.MapGet("/posts/user/{userId}", async ([FromServices] MongoDbContext dbContext, string userId) =>
{
    if (string.IsNullOrWhiteSpace(userId))
        return Results.BadRequest(new { msg = "userId is required" });

    var filterBuilder = Builders<Post>.Filter;
    var userFilter = filterBuilder.Eq(p => p.UserId, userId);
    var statusFilter = filterBuilder.In(p => p.Status, new[] { Status.Published, Status.Reported });
    var combined = filterBuilder.And(userFilter, statusFilter);

    var posts = await dbContext.PostsCollection
        .Find(combined)
        .SortByDescending(p => p.Timestamp)
        .ToListAsync();

    return Results.Ok(posts);
})
.WithSummary("Get the posts list of a specific user by id")
.Produces(200)
.Produces(400);


//GET /posts/{id}
app.MapGet("/posts/{id}", async ([FromServices] MongoDbContext dbContext, string id) =>
{
    if (string.IsNullOrWhiteSpace(id))
        return Results.BadRequest(new { msg = "id is required" });

    var filter = Builders<Post>.Filter.Eq(p => p.Id, id);
    var post = await dbContext.PostsCollection.Find(filter).FirstOrDefaultAsync();

    return post is null
        ? Results.NotFound(new { msg = "Post not found" })
        : Results.Ok(post);
})
.WithSummary("Get a specific post by id")
.Produces(200)
.Produces(400)
.Produces(404);

//PATCH /posts/{id}/status
app.MapPatch("/posts/{id}/status", async ([FromServices] MongoDbContext dbContext, string id, [FromBody] NewPostState body) =>
{
    if (string.IsNullOrWhiteSpace(id))
        return Results.BadRequest(new { msg = "id is required" });

    if (string.IsNullOrWhiteSpace(body.State))
    {
        return Results.BadRequest(new { msg = "Missing 'status' in request body" });
    }

    if (!Enum.TryParse<Status>(body.State, ignoreCase: true, out var newStatus))
    {
        return Results.BadRequest(new { msg = "Invalid status value" });
    }

    var filter = Builders<Post>.Filter.Eq(p => p.Id, id);
    var update = Builders<Post>.Update.Set(p => p.Status, newStatus);

    var result = await dbContext.PostsCollection.UpdateOneAsync(filter, update);
    if (result.MatchedCount == 0)
        return Results.NotFound(new { msg = "Post not found" });

    var updatedPost = await dbContext.PostsCollection.Find(filter).FirstOrDefaultAsync();
    return Results.Ok(updatedPost);
})
.WithSummary("Update the status of a post")
.Produces(200)
.Produces(400)
.Produces(404);

//DELETE /posts/{id}
app.MapDelete("/posts/{id}", async (
    [FromServices] MongoDbContext dbContext,
    string id
) =>
{
    if (string.IsNullOrWhiteSpace(id))
        return Results.BadRequest(new { msg = "id is required" });

    var filter = Builders<Post>.Filter.Eq(p => p.Id, id);
    var update = Builders<Post>.Update.Set(p => p.Status, Status.Deleted);

    var result = await dbContext.PostsCollection.UpdateOneAsync(filter, update);
    if (result.MatchedCount == 0)
    {
        return Results.NotFound(new { msg = "Post not found" });
    }

    return Results.Ok(new { msg = $"Post {id} marked as Deleted." });
    

})
.WithSummary("Delete a post by id")
.Produces(200)
.Produces(400)
.Produces(404);

app.Run();

record NewPostState(string State);

public partial class Program { }
