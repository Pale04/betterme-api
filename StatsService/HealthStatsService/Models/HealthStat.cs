// Models/HealthStat.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace HealthStatsService.Models
{
    public class HealthStat
    {
        // This will be the MongoDB “_id” field
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // The ID of the user this stat belongs to
        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("arms")]
        public double? Arms { get; set; }

        [BsonElement("height")]
        public double? Height { get; set; }

        // Mood is stored as an integer 1..5 (e.g. 1=Mad, 2=Sad, 3=Chill, 4=Anxious, 5=Happy)
        [BsonElement("mood")]
        public int? Mood { get; set; }

        [BsonElement("sleepHours")]
        public int? SleepHours { get; set; }

        [BsonElement("waist")]
        public double? Waist { get; set; }

        [BsonElement("weight")]
        public double? Weight { get; set; }

        [BsonElement("waterIntake")]
        public int? WaterIntake { get; set; }

        // This is the timestamp for when the user filled out this entry.
        // In the UI, the user enters “today’s date” before bedtime, so typically
        // front-end will set this to DateTime.UtcNow (or localtime), whichever you prefer.
        [BsonElement("date")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Date { get; set; }
    }
}
