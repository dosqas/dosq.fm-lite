using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

public class MonitoringHostedService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public MonitoringHostedService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var monitoringService = scope.ServiceProvider.GetRequiredService<MonitoringService>();

                // Call the monitoring logic
                await monitoringService.MonitorUserActivity();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in MonitoringHostedService: {ex.Message}");
            }

            // Wait for 10 minutes before running again
            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
        }
    }
}