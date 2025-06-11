// Services/MongoDbContext.cs
using HealthStatsService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HealthStatsService.Services
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string HealthStatsCollectionName { get; set; } = null!;
    }

    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        public IMongoCollection<HealthStat> HealthStatsCollection { get; }

        public MongoDbContext(IOptions<MongoSettings> settingsAccessor)
        {
            var settings = settingsAccessor.Value;
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
            HealthStatsCollection = _database.GetCollection<HealthStat>(settings.HealthStatsCollectionName);
        }
    }
}
