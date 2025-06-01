using Service.DTO;
using Service.Schemas;
using MongoDB.Driver;

namespace Service.DataAccess
{
    public class ReportsDB : IReportsDB
    {
        private readonly IMongoCollection<ReportSchema> _reportsCollection;

        public ReportsDB(IMongoDatabase database)
        {
            _reportsCollection = database.GetCollection<ReportSchema>("reports");
        }

        public async Task<ReportDTO> AddReport(ReportDTO newReport)
        {
            ReportSchema report = ReportSchema.FromDto(newReport);
            await _reportsCollection.InsertOneAsync(report);
            return report.ToDto();
        }

        public async Task<ReportDTO?> GetReport(string? reportId)
        {
            ReportSchema? foundReport = null;

            if (reportId != null)
            {
                var filter = Builders<ReportSchema>.Filter.Eq(r => r.Id, reportId);
                foundReport = await _reportsCollection.Find(filter).FirstOrDefaultAsync();
            }
            else
            {
                var queryableCollection = _reportsCollection.AsQueryable();
                foundReport = queryableCollection.OrderBy(r => r.ReportDate).FirstOrDefault();
            }

            return foundReport?.ToDto();
        }

        public async Task<bool> UpdateReportState(string reportId)
        {
            var filter = Builders<ReportSchema>.Filter.Eq(r => r.Id, reportId);
            var update = Builders<ReportSchema>.Update.Set(r => r.Evaluated, true);

            UpdateResult result = await _reportsCollection.UpdateOneAsync(filter, update);
            Console.WriteLine(result.ToString());
            return result.MatchedCount > 0;
        }
    }
}