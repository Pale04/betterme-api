// Models/Post.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace PostsService.Models
{
    public enum Category
    {
        Workout,
        Health,
        Medicine,
        Food
    }

    public enum Status
    {
        Reported,
        Published,
        Deleted
    }

    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonElement("mediaPath")]
        public string MediaPath { get; set; } = null!;

        [BsonElement("category")]
        [BsonRepresentation(BsonType.String)]
        public Category Category { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("timestamp")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Timestamp { get; set; }

        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public Status Status { get; set; }
    }
}
