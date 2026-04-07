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
    public IActionResult GetProjects(
        int pageHowMany = 5,
        int pageNum = 1,
        bool sortTitleAsc = true,
        [FromQuery] List<string>? categoryTypes = null)
    {
        // Build a sorted query first; Skip/Take must run after OrderBy for correct paging.
        IQueryable<Book> query = sortTitleAsc
            ? _dbContext.Books.OrderBy(b => b.Title)
            : _dbContext.Books.OrderByDescending(b => b.Title);

        if (categoryTypes is { Count: > 0 })
        {
            query = query.Where(b => categoryTypes.Contains(b.Category));
        }

        var totalNumBooks = query.Count();

        var pageOfBooks = query
            .Skip((pageNum - 1) * pageHowMany)
            .Take(pageHowMany)
            .ToList();

        var someObject = new
        {
            Books = pageOfBooks,
            TotalNumBooks = totalNumBooks
        };

        return Ok(someObject);
    }

    [HttpGet("FilterBooks")]
    public IActionResult FilterBooks([FromQuery] string? filter = null)
    {
        var filteredBooks = _dbContext.Books
        .Select(b => b.Category)
        .Distinct()
        .ToList();

        return Ok(filteredBooks);
    }

    [HttpGet("BookDetails/{bookId}")]
    public IActionResult BookDetails(int bookId)
    {
        var book = _dbContext.Books.FirstOrDefault(b => b.BookId == bookId);
        if (book == null)
        {
            return NotFound();
        }
        return Ok(book);
    }

    // Named routes (assignment-style) + REST-style so clients can POST/PUT/DELETE api/Book/...
    [HttpPost("AddBook")]
    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        book.BookId = 0;
        _dbContext.Books.Add(book);
        _dbContext.SaveChanges();
        return Ok(book);
    }

    [HttpPut("UpdateBook/{bookId}")]
    [HttpPut("{bookId:int}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updated)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existing = _dbContext.Books.Find(bookId);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Title = updated.Title;
        existing.Author = updated.Author;
        existing.Publisher = updated.Publisher;
        existing.Isbn = updated.Isbn;
        existing.Classification = updated.Classification;
        existing.Category = updated.Category;
        existing.PageCount = updated.PageCount;
        existing.Price = updated.Price;

        _dbContext.SaveChanges();
        return Ok(existing);
    }

    [HttpDelete("DeleteBook/{bookId}")]
    [HttpDelete("{bookId:int}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _dbContext.Books.Find(bookId);
        if (book == null)
        {
            return NotFound();
        }

        _dbContext.Books.Remove(book);
        _dbContext.SaveChanges();
        return NoContent();
    }
}