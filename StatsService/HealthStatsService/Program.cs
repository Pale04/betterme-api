using HealthStatsService.Models;
using HealthStatsService.Services;
using Microsoft.AspNetCore.Mvc;       
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

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

app.UseCors("AllowAllOrigins");

//POST /healthstats
app.MapPost("/healthstats", async (
    [FromServices] MongoDbContext dbContext,
    HealthStat incomingStat
) =>
{
    if (string.IsNullOrWhiteSpace(incomingStat.UserId))
    {
        return Results.BadRequest(new { msg = "UserId is required" });
    }
    if (incomingStat.Date == default)
    {
        return Results.BadRequest(new { msg = "Date must be provided" });
    }

    try
    {
        await dbContext.HealthStatsCollection.InsertOneAsync(incomingStat);
        return Results.Created($"/healthstats/{incomingStat.UserId}", incomingStat);
    }
    catch (MongoException mex)
    {
        return Results.Problem(detail: mex.Message, statusCode: 500);
    }
});

//GET /healthstats/{userId}
app.MapGet("/healthstats/{userId}", async (
    [FromServices] MongoDbContext dbContext,
    string userId
) =>
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.BadRequest(new { msg = "Invalid userId" });
    }

    var fourMonthsAgo = DateTime.UtcNow.AddMonths(-4);

    try
    {
        var filter = Builders<HealthStat>.Filter.Where(
            stat => stat.UserId == userId && stat.Date >= fourMonthsAgo
        );
        var stats = await dbContext.HealthStatsCollection
                                   .Find(filter)
                                   .SortByDescending(stat => stat.Date)
                                   .ToListAsync();
        return Results.Ok(stats);
    }
    catch (MongoException mex)
    {
        return Results.Problem(detail: mex.Message, statusCode: 500);
    }
});


app.Run();
