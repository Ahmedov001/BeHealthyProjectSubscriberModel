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
	public async Task<Subscriber> Subscribe(string dietitianId, string userId, string plan)
	{
		var dietitianBaseUser = await _userManager.FindByIdAsync(dietitianId);
		var userBaseUser = await _userManager.FindByIdAsync(userId);

		var dietitian = dietitianBaseUser as Dietitian;
		var user = userBaseUser as User;

		if (dietitian == null || user == null)
			throw new Exception("Either the Dietitian or the User was not found!");

		var existingSubscription = await _dbContext.Subscribers
			.FirstOrDefaultAsync(s => s.DietitianId == dietitian.Id && s.SubscriberId == user.Id);

		if (existingSubscription != null)
			throw new Exception("User is already subscribed to this dietitian.");

		var newSubscription = new Subscriber
		{
			DietitianId = dietitian.Id,
			SubscriberId = user.Id,
			Plan = plan
		};

		await _dbContext.Subscribers.AddAsync(newSubscription);
		await _dbContext.SaveChangesAsync();

		return newSubscription;
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
}
