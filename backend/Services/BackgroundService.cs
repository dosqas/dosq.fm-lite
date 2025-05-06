namespace backend.Services;

public class MonitoringHostedService(IServiceProvider serviceProvider) : BackgroundService
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("MonitoringHostedService started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var monitoringService = scope.ServiceProvider.GetRequiredService<MonitoringService>();

                // Call the monitoring logic
                Console.WriteLine("Executing MonitorUserActivity...");
                await monitoringService.MonitorUserActivity();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in MonitoringHostedService: {ex.Message}");
            }

            // Wait before running again
            Console.WriteLine("Waiting for 30 seconds...");
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }

        Console.WriteLine("MonitoringHostedService stopped.");
    }
}