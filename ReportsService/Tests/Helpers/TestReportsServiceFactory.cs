using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Tests.Helpers;

public class TestWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var databaseDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IMongoDatabase));
            if (databaseDescriptor != null) services.Remove(databaseDescriptor);

            services.AddScoped(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                return client.GetDatabase("betterMeDBTest");
            });

            var authDescriptors = services
                .Where(d => d.ServiceType == typeof(IConfigureOptions<AuthenticationOptions>))
                .ToList();

            foreach (var descriptor in authDescriptors)
            {
                services.Remove(descriptor);
            }

            var jwtBearerDescriptors = services
                .Where(d => d.ServiceType == typeof(IConfigureNamedOptions<JwtBearerOptions>))
                .ToList();

            foreach (var descriptor in jwtBearerDescriptors)
            {
                services.Remove(descriptor);
            }
        });
    }
}
