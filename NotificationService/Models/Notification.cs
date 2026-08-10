using System;
using System.ComponentModel.DataAnnotations;

namespace NotificationService.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public long UserId { get; set; }
        
        public string? Email { get; set; }
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        [Required]
        public string Type { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsRead { get; set; } = false;
        
        public bool EmailSent { get; set; } = false;
        
        public decimal? Amount { get; set; }
        
        public string? ServiceName { get; set; }
        
        public DateTime? BookingDate { get; set; }
    }
}
