using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Service.DTO;

namespace Service.Schemas 
{
    public class ReportSchema
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string PostId { get; set; }

        public DateTime ReportDate { get; set; } = DateTime.UtcNow;

        public required string Reason { get; set; }

        public bool Evaluated { get; set; } = false;

        public static ReportSchema FromDto(ReportDTO report)
        {
            return new ReportSchema
            {
                Id = report.Id,
                PostId = report.PostId,
                ReportDate = report.ReportDate,
                Reason = report.Reason,
                Evaluated = report.Evaluated
            };
        }

        public ReportDTO ToDto()
        {
            return new ReportDTO
            {
                Id = Id,
                PostId = PostId,
                ReportDate = ReportDate,
                Reason = Reason,
                Evaluated = Evaluated
            };
        }
    }
}