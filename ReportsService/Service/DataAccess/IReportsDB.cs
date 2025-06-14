using Service.DTO;

namespace Service.DataAccess
{
    public interface IReportsDB
    {
        public Task<ReportDTO> AddReport(ReportDTO newReport);

        /// <summary>
        /// Get a report by Id, the oldest if id is null.
        /// </summary>
        /// <param name="reportId"></param>
        /// <returns>Found report or null if not exist</returns>
        public Task<ReportDTO?> GetReport(string? reportId);
        public Task<bool> UpdateReportState(string reportId);
    }
}