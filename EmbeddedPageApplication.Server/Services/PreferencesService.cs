using System.Collections.Concurrent;
using EmbeddedPageApplication.Server.Models.Preferences;

namespace EmbeddedPageApplication.Server.Services;

/// <summary>
/// In-memory stub backend. Each user gets their own copy of the seed data so
/// updates persist for the lifetime of the process. Replace with a real data
/// store / downstream consent service for production.
/// </summary>
public class PreferencesService : IPreferencesService
{
    private readonly ConcurrentDictionary<string, List<Purpose>> _store = new();

    public UserPreferencesResponse GetUserPreferences(string userId, string collectionPointId)
    {
        var purposes = _store.GetOrAdd(userId, _ => CreateSeed());

        return new UserPreferencesResponse
        {
            Meta = new ResponseMeta { CorrelationId = Guid.NewGuid().ToString() },
            Data = purposes,
        };
    }

    public void UpdateUserPreferences(UpdateUserPreferencesRequest request)
    {
        var purposes = _store.GetOrAdd(request.UserId, _ => CreateSeed());

        foreach (var update in request.Purposes)
        {
            var purpose = purposes.FirstOrDefault(p => p.Id == update.PurposeId);
            if (purpose is null)
            {
                continue;
            }

            purpose.Status = update.Status;

            // A preference is consented when its id or type is present in the update list.
            var consentedKeys = new HashSet<string>(update.CommunicationPreferences);
            foreach (var preference in purpose.CommunicationPreferences)
            {
                var isConsented = consentedKeys.Contains(preference.Id) || consentedKeys.Contains(preference.Type);
                foreach (var option in preference.Options)
                {
                    option.Consented = isConsented;
                }
            }
        }
    }

    private static List<Purpose> CreateSeed() => new()
    {
        new Purpose
        {
            Id = "purpose-marketing",
            Label = "Marketing Communications",
            Description = "Receive personalised offers, promotions and news about our products.",
            Status = "CONFIRMED",
            Version = 1,
            PurposeType = "marketing",
            CommunicationPreferences =
            {
                new CommunicationPreference
                {
                    Id = "pref-email-marketing", Name = "Email", Type = "email",
                    Options = { new NotificationOption { Id = "opt-email-marketing", Type = "newsletter", Consented = true } },
                },
                new CommunicationPreference
                {
                    Id = "pref-sms-marketing", Name = "SMS", Type = "sms",
                    Options = { new NotificationOption { Id = "opt-sms-marketing", Type = "promotional", Consented = false } },
                },
                new CommunicationPreference
                {
                    Id = "pref-push-marketing", Name = "Push Notification", Type = "push",
                    Options = { new NotificationOption { Id = "opt-push-marketing", Type = "promotional", Consented = true } },
                },
            },
        },
        new Purpose
        {
            Id = "purpose-product",
            Label = "Product Updates",
            Description = "Stay informed about new features, release notes and service changes.",
            Status = "CONFIRMED",
            Version = 1,
            PurposeType = "product",
            CommunicationPreferences =
            {
                new CommunicationPreference
                {
                    Id = "pref-email-product", Name = "Email", Type = "email",
                    Options = { new NotificationOption { Id = "opt-email-product", Type = "product-update", Consented = true } },
                },
                new CommunicationPreference
                {
                    Id = "pref-sms-product", Name = "SMS", Type = "sms",
                    Options = { new NotificationOption { Id = "opt-sms-product", Type = "product-update", Consented = true } },
                },
            },
        },
        new Purpose
        {
            Id = "purpose-research",
            Label = "Research & Surveys",
            Description = "Help us improve by participating in surveys and user research sessions.",
            Status = "WITHDRAWN",
            Version = 1,
            PurposeType = "research",
            CommunicationPreferences =
            {
                new CommunicationPreference
                {
                    Id = "pref-email-research", Name = "Email", Type = "email",
                    Options = { new NotificationOption { Id = "opt-email-research", Type = "survey", Consented = false } },
                },
                new CommunicationPreference
                {
                    Id = "pref-push-research", Name = "Push Notification", Type = "push",
                    Options = { new NotificationOption { Id = "opt-push-research", Type = "survey", Consented = false } },
                },
            },
        },
    };
}