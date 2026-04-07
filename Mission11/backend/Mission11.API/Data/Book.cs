using System.ComponentModel.DataAnnotations;

namespace Mission11.API.Data;

public class Book
{
    [Key] [Required]
    public int BookId { get; set; }

    [Required]
    public required string Title { get; set; }

    [Required]
    public required string Author { get; set; }

    [Required]
    public required string Publisher { get; set; }

    [Required]
    public required string Isbn { get; set; }

    [Required]
    public required string Classification { get; set; }

    [Required]
    public required string Category { get; set; }

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}