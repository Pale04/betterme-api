using HealthStatsService.Models;
using HealthStatsService.Services;
using Microsoft.AspNetCore.Mvc;       
using MongoDB.Driver;

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

//POST /healthstats
app.MapPost("/healthstats", async ([FromServices] MongoDbContext dbContext, HealthStat incomingStat) =>
{
    if (string.IsNullOrWhiteSpace(incomingStat.UserId))
    {
        return Results.BadRequest(new { msg = "UserId is required" });
    }
    if (incomingStat.Date == default)
    {
        return Results.BadRequest(new { msg = "Date must be provided" });
    }

    
    var getExistentStats = Builders<HealthStat>.Filter.Where(stat => stat.Date.CompareTo(incomingStat.Date) == 0);
    try
    {
        var todaysStats = await dbContext.HealthStatsCollection.Find(getExistentStats).FirstOrDefaultAsync();
        if (todaysStats == null)
        {
            await dbContext.HealthStatsCollection.InsertOneAsync(incomingStat);
        }
        else
        {
            //var filter = Builders<HealthStat>.Filter.Eq("_id", todaysStats.Id);
            UpdateDefinition<HealthStat> update;

            if (incomingStat.Arms != null)
            {
                update = Builders<HealthStat>.Update.Set("arms", incomingStat.Arms);
            }
            else if (incomingStat.Mood != null)
            {
                update = Builders<HealthStat>.Update.Set("mood", incomingStat.Mood);
            }
            else if (incomingStat.SleepHours != null)
            {
                update = Builders<HealthStat>.Update.Set("sleepHours", incomingStat.SleepHours);
            }
            else if (incomingStat.Waist != null)
            {
                update = Builders<HealthStat>.Update.Set("waist", incomingStat.Waist);
            }
            else if (incomingStat.Weight != null)
            {
                update = Builders<HealthStat>.Update.Set("weight", incomingStat.Weight);
            }
            else// if (incomingStat.WaterIntake != null)
            {
                update = Builders<HealthStat>.Update.Set("waterIntake", incomingStat.WaterIntake);
            }

            await dbContext.HealthStatsCollection.UpdateOneAsync(getExistentStats, update);
        }
    }
    catch (MongoException error)
    {
        return Results.Problem(detail: error.Message, statusCode: 500);
    }
    
    return Results.Created($"/healthstats/{incomingStat.UserId}", incomingStat);
})
.WithSummary("Add the user health stats partially or totally, for a specific day")
.Produces(201)
.Produces(404)
.Produces(500);

//GET /healthstats/{userId}
app.MapGet("/healthstats/{userId}", async ([FromServices] MongoDbContext dbContext, string userId) =>
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.BadRequest(new { msg = "Invalid userId" });
    }

    var oneMonthAgoDate = DateTime.UtcNow.AddDays(-28);

    try
    {
        var filter = Builders<HealthStat>.Filter.Where(stat => stat.UserId == userId && stat.Date.CompareTo(oneMonthAgoDate) >= 0);
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
})
.WithSummary("Obtain a list of the last four months registered health stats by a user")
.Produces(200)
.Produces(404)
.Produces(500);


app.Run();

public partial class Program
{ }