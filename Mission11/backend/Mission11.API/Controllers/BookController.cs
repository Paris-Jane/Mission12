using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;

namespace Mission11.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookController : Controller
{
    private BookstoreDbContext _dbContext; // Allows instance of dbContext to be visible in all methods
    
    public BookController(BookstoreDbContext temp) // CONSTRUCTOR (creates instance of dbcontext)
    {
        _dbContext = temp;
    }
    
    [HttpGet("AllBooks")]
    public IActionResult GetProjects(int pageHowMany = 5, int pageNum = 1, bool sortTitleAsc = true)
    {
        // Build a sorted query first; Skip/Take must run after OrderBy for correct paging.
        IQueryable<Book> ordered = sortTitleAsc
            ? _dbContext.Books.OrderBy(b => b.Title)
            : _dbContext.Books.OrderByDescending(b => b.Title);

        var pageOfBooks = ordered
            .Skip((pageNum - 1) * pageHowMany)
            .Take(pageHowMany)
            .ToList();

        var totalNumBooks = _dbContext.Books.Count();

        var someObject = new
        {
            Books = pageOfBooks,
            TotalNumBooks = totalNumBooks
        };

        return Ok(someObject);
    }
}