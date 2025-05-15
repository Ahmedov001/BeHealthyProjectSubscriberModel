using System.Text.Json.Serialization;

public class FoodNutritionDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("calories")]
    public string Calories { get; set; }

    [JsonPropertyName("serving_size_g")]
    public string Serving_size_g { get; set; }

    [JsonPropertyName("fat_total_g")]
    public float FatTotalG { get; set; }

    [JsonPropertyName("fat_saturated_g")]
    public float FatSaturatedG { get; set; }

    [JsonPropertyName("protein_g")]
    public string ProteinG { get; set; }

    [JsonPropertyName("sodium_mg")]
    public float SodiumMg { get; set; }

    [JsonPropertyName("potassium_mg")]
    public float PotassiumMg { get; set; }

    [JsonPropertyName("cholesterol_mg")]
    public float CholesterolMg { get; set; }

    [JsonPropertyName("carbohydrates_total_g")]
    public float CarbohydratesTotalG { get; set; }

    [JsonPropertyName("fiber_g")]
    public float FiberG { get; set; }

    [JsonPropertyName("sugar_g")]
    public float SugarG { get; set; }
}
