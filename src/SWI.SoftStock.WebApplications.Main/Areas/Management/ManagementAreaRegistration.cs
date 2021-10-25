using Microsoft.AspNetCore.Builder;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management
{
    public static class ManagementAreaRegistration
	{
        public static void UseEndpointsManagement(this IApplicationBuilder app)
        {
            app.UseEndpoints(endpoints =>
            {                
            });
        }
    }
}