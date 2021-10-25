using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace SWI.SoftStock.WebApplications.Main.Helpers
{
    public class S3AgentLoader : IAgentLoader
    {
        private readonly Uri baseUri;
        private readonly ILogger<S3AgentLoader> log;

        public S3AgentLoader(ILogger<S3AgentLoader> log, AgentLoaderOptions options)
        {
            this.log = log;
            this.baseUri = new Uri(options.SourceBaseUrl);
        }

        /// <inheritdoc />
        public async Task<Stream> GetStreamAsync(string sourceFile)
        {
            var uriBuilder = new UriBuilder(baseUri);
            uriBuilder.Path += $"{sourceFile.ToLower()}";
            log.LogInformation($"Trying read file from s3 bucket :{sourceFile} uri:{uriBuilder.Uri}");
            using (var client = new HttpClient())
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = uriBuilder.Uri,
                    Method = HttpMethod.Get,
                };
                var response = await client.SendAsync(request);

                return await response.Content.ReadAsStreamAsync();
            }
        }
    }
}
