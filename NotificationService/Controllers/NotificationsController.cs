using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace NotificationService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(NotificationDbContext context, IConfiguration configuration, ILogger<NotificationsController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/notifications
        [HttpPost]
        public async Task<ActionResult<Notification>> PostNotification([FromBody] Notification request)
        {
            // 1. Always save the notification to the DB first
            var notification = new Notification
            {
                UserId = request.UserId,
                Email = request.Email,
                Message = request.Message,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                EmailSent = false,
                Amount = request.Amount,
                ServiceName = request.ServiceName,
                BookingDate = request.BookingDate
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 2. Attempt to send email if an email address is provided
            if (!string.IsNullOrEmpty(notification.Email))
            {
                try
                {
                    var senderEmail = _configuration["EmailSettings:SenderEmail"];
                    var appPassword = _configuration["EmailSettings:AppPassword"];

                    if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(appPassword))
                    {
                        _logger.LogWarning("EmailSettings are missing in configuration. Skipping email send.");
                    }
                    else
                    {
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress("Household Connect", senderEmail));
                        message.To.Add(new MailboxAddress("", notification.Email));
                        message.Subject = GetSubjectFromType(notification.Type);

                        var bodyBuilder = new BodyBuilder();
                        
                        bool isInvoice = (notification.Type == "BOOKING_CONFIRMED" || 
                                          notification.Type == "PAYMENT_SUCCESS" || 
                                          notification.Type == "SUBSCRIPTION_PURCHASED" ||
                                          notification.Type == "BOOKING_CANCELLED" ||
                                          notification.Type == "BOOKING_REJECTED") && 
                                          (notification.Amount.HasValue || !string.IsNullOrEmpty(notification.ServiceName));

                        if (isInvoice)
                        {
                            string dateStr = notification.BookingDate.HasValue 
                                ? notification.BookingDate.Value.ToString("dd MMM yyyy, h:mm tt") 
                                : "N/A";
                            string amountStr = notification.Amount.HasValue 
                                ? $"₹{notification.Amount.Value:0.00}" 
                                : "N/A";
                            string nameLabel = notification.Type == "SUBSCRIPTION_PURCHASED" ? "Plan Name" : "Service Name";

                            bodyBuilder.HtmlBody = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
                                <div style='background-color: #0d9488; color: white; padding: 20px; text-align: center;'>
                                    <h2 style='margin: 0;'><strong>Household Connect</strong></h2>
                                </div>
                                <div style='padding: 20px;'>
                                    <h3 style='color: #333; margin-top: 0;'>{GetSubjectFromType(notification.Type).Replace(" - Household Connect", "")}</h3>
                                    <p style='color: #555;'>{notification.Message}</p>
                                    <table style='width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;'>
                                        <tr style='border-bottom: 1px solid #ddd;'>
                                            <td style='padding: 10px 0; color: #666;'><strong>{nameLabel}</strong></td>
                                            <td style='padding: 10px 0; color: #333; text-align: right;'>{notification.ServiceName ?? "N/A"}</td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #ddd;'>
                                            <td style='padding: 10px 0; color: #666;'><strong>Amount Paid</strong></td>
                                            <td style='padding: 10px 0; color: #333; text-align: right;'>{amountStr}</td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #ddd;'>
                                            <td style='padding: 10px 0; color: #666;'><strong>Date</strong></td>
                                            <td style='padding: 10px 0; color: #333; text-align: right;'>{dateStr}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 10px 0; color: #666;'><strong>Status</strong></td>
                                            <td style='padding: 10px 0; color: #0d9488; text-align: right;'><strong>{notification.Type.Replace("BOOKING_", "").Replace("PAYMENT_", "").Replace("SUBSCRIPTION_", "")}</strong></td>
                                        </tr>
                                    </table>
                                    <p style='color: #777; font-size: 14px; text-align: center; margin-top: 30px;'>
                                        Thank you for choosing Household Connect!
                                    </p>
                                </div>
                            </div>";
                        }
                        else
                        {
                            bodyBuilder.HtmlBody = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
                                <div style='background-color: #0d9488; color: white; padding: 20px; text-align: center;'>
                                    <h2 style='margin: 0;'><strong>Household Connect</strong></h2>
                                </div>
                                <div style='padding: 30px 20px; text-align: center;'>
                                    <p style='color: #444; font-size: 16px; line-height: 1.5;'>{notification.Message}</p>
                                </div>
                                <div style='background-color: #f9f9f9; padding: 15px; text-align: center;'>
                                    <p style='color: #777; font-size: 14px; margin: 0;'>Thank you for choosing Household Connect!</p>
                                </div>
                            </div>";
                        }

                        message.Body = bodyBuilder.ToMessageBody();

                        using (var client = new SmtpClient())
                        {
                            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                            await client.AuthenticateAsync(senderEmail, appPassword);
                            await client.SendAsync(message);
                            await client.DisconnectAsync(true);
                        }

                        // Update EmailSent to true on success
                        notification.EmailSent = true;
                        await _context.SaveChangesAsync();
                        _logger.LogInformation("Email sent successfully for Notification {Id}", notification.Id);
                    }
                }
                catch (Exception ex)
                {
                    // Log the error but DO NOT fail the request
                    _logger.LogError(ex, "Failed to send email for Notification {Id}", notification.Id);
                }
            }

            return CreatedAtAction(nameof(GetNotificationsByUser), new { userId = notification.UserId }, notification);
        }

        // GET: api/notifications/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotificationsByUser(long userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        private string GetSubjectFromType(string type)
        {
            return type switch
            {
                "BOOKING_CONFIRMED" => "Booking Confirmed - Household Connect",
                "PAYMENT_SUCCESS" => "Payment Successful - Household Connect",
                "SUBSCRIPTION_PURCHASED" => "Subscription Purchased - Household Connect",
                _ => "New Notification - Household Connect"
            };
        }
    }
}
