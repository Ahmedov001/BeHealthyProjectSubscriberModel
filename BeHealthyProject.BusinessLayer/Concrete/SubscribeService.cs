using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.Entities;
using BeHealthyProject.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class SubscribeService : ISubscribeService
{
	private readonly BeHealthyDbContext _dbContext;
	private readonly UserManager<BaseUser> _userManager;

	public SubscribeService(BeHealthyDbContext dbContext, UserManager<BaseUser> userManager)
	{
		_dbContext = dbContext;
		_userManager = userManager;
	}
    public async Task<(bool Success, string Message)> Subscribe(string userId, string dietitianId, string plan)
    {
        var existing = await _dbContext.Subscribers
            .FirstOrDefaultAsync(s => s.SubscriberId == userId && s.DietitianId == dietitianId);

        if (existing != null)
            return (false, "Already subscribed.");

        var newSub = new Subscriber
        {
            SubscriberId = userId,
            DietitianId = dietitianId,
            Plan = plan
        };

        await _dbContext.Subscribers.AddAsync(newSub);
        await _dbContext.SaveChangesAsync();

        return (true, "Subscribed successfully.");
    }



    public async Task<Subscriber> Unsubscribe(string dietitianId, string userId)
	{
		var subscription = await _dbContext.Subscribers
			.FirstOrDefaultAsync(s => s.DietitianId == dietitianId && s.SubscriberId == userId);

		if (subscription == null)
			throw new Exception("Subscription not found.");

		_dbContext.Subscribers.Remove(subscription);
		await _dbContext.SaveChangesAsync();

		return subscription;
	}

	public async Task<List<string>> GetSubscribers(string dietitianId)
	{
		var subscriberIds = await _dbContext.Subscribers
			.Where(s=> s.DietitianId ==dietitianId)
			.Select(s => s.SubscriberId)
			.ToListAsync();


		return subscriberIds;
	}

	public async Task<List<string>> GetSubscribedDietitians(string userId)
	{
		var dietitianIds = await _dbContext.Subscribers
			.Where(s => s.SubscriberId == userId)
			.Select(s => s.DietitianId)
			.ToListAsync();

		return dietitianIds;
	}

    public async Task<List<DietProgram>> GetSubscribedDietProgramsAsync(string userId)
    {
        var subscriptions = await _dbContext.Subscribers
            .Where(s => s.SubscriberId == userId)
            .ToListAsync();

        var dietitianIds = subscriptions.Select(s => s.DietitianId).Distinct().ToList();

        var dietPrograms = await _dbContext.DietPrograms
            .Include(dp => dp.Meals)
                .ThenInclude(m => m.Items)
            .Where(dp => dietitianIds.Contains(dp.DietitianId))
            .ToListAsync();

        return dietPrograms;
    }
}
