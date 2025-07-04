using MongoDB.Driver;
using Service.DataAccess;
using Service.DTO;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Service.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("All",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var config = builder.Configuration;
    var connectionString = config["MongoConnection"];
    Console.WriteLine(connectionString);
    if (connectionString == null)
    {
        Console.WriteLine("You must set your mongo connection in appsettings.json.");
        Environment.Exit(0);
    }
    
    return new MongoClient(connectionString);
});

builder.Services.AddScoped(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("betterMeDB");
});

builder.Services.AddScoped<IReportsDB, ReportsDB>();
builder.Services.AddScoped<PostService>();

builder.Services.AddHttpClient("PostsAPI", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["PostsUrl"]);
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        string keyFile = "";
        try
        {
            keyFile = File.ReadAllText("./App_Data/public.key");
        }
        catch (DirectoryNotFoundException error)
        {
            Console.WriteLine($"No se encontró la llave pública: {error.Message}");
            Environment.Exit(0);
        }
        var rsa = RSA.Create();
        rsa.ImportFromPem(keyFile.ToCharArray());
        var key = new RsaSecurityKey(rsa);
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("OnlyMember", policy => policy.RequireRole("Member"))
    .AddPolicy("OnlyModerator", policy => policy.RequireRole("Moderator"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors("All");
app.UseAuthentication();
app.UseAuthorization();


app.MapPost("/reports", async ([FromBody] Report report, [FromServices] IReportsDB dbService, [FromServices] ILogger<Program> logger, [FromServices] PostService postService) =>
{
    if (string.IsNullOrWhiteSpace(report.PostId) || string.IsNullOrWhiteSpace(report.Reason))
    {
        return Results.BadRequest("The post id and reason fields are required");
    }

    ReportDTO addedReport;
    try
    {
        addedReport = await dbService.AddReport(new ReportDTO { PostId = report.PostId, Reason = report.Reason });
    }
    catch (Exception error)
    {
        logger.LogError("Error while attempting to register the report: {error}", error);
        return Results.Problem(detail: "A server error ocurred while attempting to create the report", statusCode: 500);
    }

    try
    {
        await postService.UpdatePostState(report.PostId, PostState.Reported);
    }
    catch (HttpRequestException error)
    {
        logger.LogError("Error while attempting to send request to PostService for state update: {error}", error);
    }
    catch (Exception error)
    {
        logger.LogError(error.Message);
    }

    return Results.Created("/reports/" + addedReport.Id, addedReport);

})
.WithSummary("Add a new report")
.Produces(201)
.Produces(400)
.Produces(401)
.Produces(403)
.Produces(404)
.Produces(500)
.RequireAuthorization("OnlyMember");


app.MapGet("/reports/{id}", async (string id, [FromServices] IReportsDB dbService, [FromServices] ILogger<Program> logger) =>
{
    ReportDTO? result;

    try
    {
        result = await dbService.GetReport(id);
    }
    catch (Exception error)
    {
        logger.LogError("Error while attempting to get a report: {error}", error);
        return Results.Problem(detail: "A server error ocurred while attempting to get the report", statusCode: 500);
    }

    return result == null ? Results.NotFound() : Results.Ok(result);
})
.WithSummary("Get a specific report by Id")
.Produces(200)
.Produces(401)
.Produces(403)
.Produces(404)
.Produces(500)
.RequireAuthorization("OnlyModerator");


app.MapGet("/reports", async ([FromServices] IReportsDB dbService, [FromServices] ILogger<Program> logger) =>
{
    ReportDTO? result;

    try
    {
        result = await dbService.GetReport(null);
    }
    catch (Exception error)
    {
        logger.LogError("Error while attempting to get a report: {error}", error);
        return Results.Problem(detail: "A server error ocurred while attempting to get the report", statusCode: 500);
    }

    return result == null ? Results.NotFound() : Results.Ok(result);
})
.WithSummary("Get the oldest non-evaluated report")
.Produces(200)
.Produces(401)
.Produces(403)
.Produces(404)
.Produces(500)
.RequireAuthorization("OnlyModerator");


app.MapPatch("/reports/{id}", async(string id, [FromBody] EvaluatedReport evaluatedReport, [FromServices] IReportsDB dbService, [FromServices] ILogger<Program> logger, [FromServices] PostService postService) =>
{
    if (evaluatedReport.Ok == null)
    {
        return Results.BadRequest("The Ok field is requiered");
    }

    bool result;
    try
    {
        result = await dbService.UpdateReportState(id);
    }
    catch (Exception error)
    {
        logger.LogError("Error while attempting to update the report state: {error}", error);
        return Results.Problem(detail: "Error while attempting to update the report state", statusCode: 500);
    }

    if ((bool)evaluatedReport.Ok)
    {
        try
        {
            var report = await dbService.GetReport(id);
            await postService.UpdatePostState(report!.PostId, PostState.Published);
        }
        catch (HttpRequestException error)
        {
            logger.LogError("Error while attempting to send request to PostService for state update: {error}", error);
        }
        catch (Exception error)
        {
            logger.LogError(error.Message);
        }
    }
    else
    {
        try
        {
            var report = await dbService.GetReport(id);
            await postService.UpdatePostState(report.PostId, PostState.Deleted);
        }
        catch (HttpRequestException error)
        {
            logger.LogError("Error while attempting to send request to PostService for state update: {error}", error);
        }
        catch (Exception error)
        {
            logger.LogError(error.Message);
        }
    }

    return result ? Results.Ok("Report state update successful") : Results.NotFound("The report cannot be found");
})
.WithSummary("Update the report state")
.Produces(200)
.Produces(400)
.Produces(401)
.Produces(403)
.Produces(404)
.Produces(500)
.RequireAuthorization("OnlyModerator");;

app.Run();

record Report(string PostId, string Reason);
record EvaluatedReport(bool? Ok);

public partial class Program
{ }
