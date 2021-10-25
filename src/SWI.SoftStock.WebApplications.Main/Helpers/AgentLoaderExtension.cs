using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SWI.SoftStock.WebApplications.Main.Helpers
{
    public static class AgentLoaderExtension
    {
        public static IServiceCollection AddAgentLoader(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("AgentLoader").Get<AgentLoaderOptions>();
            services.AddSingleton(options);

            if (options.UseS3Bucket)
            {
                services.AddSingleton<IAgentLoader, S3AgentLoader>();
            }
            else
            {
                services.AddSingleton<IAgentLoader, LocalFileAgentLoader>();
            }
            return services;
        }
    }
}