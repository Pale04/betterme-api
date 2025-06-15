using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PostsService.Models;

namespace PostsService.Services
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string PostsCollectionName { get; set; } = null!;
    }

    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<Post> PostsCollection { get; }

        public MongoDbContext(IOptions<MongoSettings> settingsAccessor)
        {
            var settings = settingsAccessor.Value;
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
            PostsCollection = _database.GetCollection<Post>(settings.PostsCollectionName);
        }
    }
}
