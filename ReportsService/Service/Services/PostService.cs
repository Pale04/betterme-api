using System.Net;

namespace Service.Services
{
    public enum PostState
    {
        Reported,
        Published,
        Deleted
    }
    
    public class PostService
    {
        private readonly HttpClient _httpClient;

        public PostService(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("PostsAPI");
        }

        public async Task UpdatePostState(string postId, PostState state)
        {
            HttpResponseMessage httpResponse = await _httpClient.PostAsJsonAsync($"{postId}/{state}", new { State = state });

            if (httpResponse.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Error while attempting to change the post status: id = {postId}, stat = {state}, error code = {httpResponse.StatusCode}, error message: {await httpResponse.Content.ReadAsStringAsync()}");
            }
        }
    }
}