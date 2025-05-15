using BeHealthyProject.Server.Data;
using BeHealthyProject.Server.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class FoodController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly BeHealthyDbContext _context;

    public FoodController(HttpClient httpClient, BeHealthyDbContext beHealthyDbContext)
    {
        _httpClient = httpClient;
        _context = beHealthyDbContext;
        _httpClient.DefaultRequestHeaders.Add("X-Api-Key", "aHtKNqmB1UJMAO6t6nBiHA==5pgMi9i94VuMsPpo");
    }

    [HttpPost("seed-foods")]
    public async Task<IActionResult> SeedFoods()
    {
        try
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "foods.txt");

            if (!System.IO.File.Exists(filePath))
                return NotFound("foods.txt tapılmadı.");

            var foodNames = await System.IO.File.ReadAllLinesAsync(filePath);

            foreach (var food in foodNames)
            {
                if (string.IsNullOrWhiteSpace(food)) continue;

                var response = await _httpClient.GetAsync($"https://api.api-ninjas.com/v1/nutrition?query={food}");

                if (!response.IsSuccessStatusCode)
                    continue;

                var content = await response.Content.ReadAsStringAsync();

                var foodData = JsonSerializer.Deserialize<List<FoodNutritionDto>>(content,
                               new JsonSerializerOptions { PropertyNameCaseInsensitive = true });


                if (foodData == null || !foodData.Any())
                    continue;

                var f = foodData.First();

                float.TryParse(f.Calories, out float caloriesValue);
                float.TryParse(f.Serving_size_g, out float servingSizeValue);
                float.TryParse(f.ProteinG, out float proteinValue);

                var foodEntity = new Food
                {
                    Name = string.IsNullOrWhiteSpace(f.Name) ? "Unknown" : f.Name,
                    Calories = caloriesValue,
                    ServingSizeG = servingSizeValue,
                    FatTotalG = f.FatTotalG,
                    FatSaturatedG = f.FatSaturatedG,
                    ProteinG = proteinValue,
                    SodiumMg = f.SodiumMg,
                    PotassiumMg = f.PotassiumMg,
                    CholesterolMg = f.CholesterolMg,
                    CarbohydratesTotalG = f.CarbohydratesTotalG,
                    FiberG = f.FiberG,
                    SugarG = f.SugarG,
                };

                await _context.Foods.AddAsync(foodEntity);
            }

            await _context.SaveChangesAsync();

            return Ok("Foods seeding tamamlandı.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Bir xəta baş verdi.",
                details = ex.InnerException?.Message ?? ex.Message
            });
        }
    }

    [HttpGet("foods")]
    public IActionResult GetFoods()
    {
        try
        {
            var foods = _context.Foods
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Calories,
                    f.ProteinG,
                    f.FatTotalG,
                    f.CarbohydratesTotalG,
                    f.CholesterolMg,
                    f.PotassiumMg,
                    f.SugarG
                })
                .ToList();

            return Ok(foods);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Məlumatlar oxunarkən xəta baş verdi.",
                details = ex.InnerException?.Message ?? ex.Message
            });
        }
    }


}
