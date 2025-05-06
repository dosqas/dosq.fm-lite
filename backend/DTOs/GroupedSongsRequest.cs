namespace backend.DTOs;

public class GroupedSongsRequest
{
    public string? RangeType { get; set; }
    public int? Year { get; set; }
    public int? Month { get; set; }
    public int? Day { get; set; }
}