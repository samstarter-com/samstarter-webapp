using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace SWI.SoftStock.WebApplications.Main.Helpers
{
    public class LocalFileAgentLoader : IAgentLoader
    {
        private readonly ILogger<LocalFileAgentLoader> log;

        public LocalFileAgentLoader(ILogger<LocalFileAgentLoader> log)
        {
            this.log = log;
        }

        /// <inheritdoc />
        public async Task<Stream> GetStreamAsync(string sourceFile)
        {
            var virtualFilePath = $"wwwroot/Files/{sourceFile.ToLower()}";
            log.LogInformation($"Trying read file from file system :{sourceFile} virtualFilePath:{virtualFilePath}");
            using var task = Task.Run(
                () =>
                {
                    var stream = new FileStream(virtualFilePath, FileMode.Open, FileAccess.Read);
                    return stream;
                });
            return await task;
        }
    }
}