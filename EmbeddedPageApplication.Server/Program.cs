using EmbeddedPageApplication.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// MVC controllers (the React SPA provides the views).
builder.Services.AddControllersWithViews();

// In-memory stub backend for consent / preferences data.
builder.Services.AddSingleton<IPreferencesService, PreferencesService>();

// Allow the SPA to be embedded/called from approved parent origins.
var allowedOrigins = (builder.Configuration["AllowedParentOrigins"] ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Serve the built SPA from wwwroot in production. In development the
// Microsoft.AspNetCore.SpaProxy package redirects to the Vite dev server
// (launched via SpaProxyLaunchCommand) instead.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseAuthorization();

app.MapControllers();

// Client-side routes (e.g. /preferences, /unsubscribe) fall back to the SPA shell.
app.MapFallbackToFile("/index.html");

app.Run();