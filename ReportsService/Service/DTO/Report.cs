namespace Service.DTO 
{
    public class ReportDTO
    {
        public string? Id { get; set; } = null;

        public required string PostId { get; set; }

        public DateTime ReportDate { get; set; } = DateTime.UtcNow;

        public required string Reason { get; set; }

        public bool Evaluated { get; set; } = false;
    }
}