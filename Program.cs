using EmbeddedPageApplication.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// MVC controllers (views are provided by the React SPA).
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

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    // Proxy every non-API request to the Vite dev server (`npm run dev`).
    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";
        spa.UseProxyToSpaDevelopmentServer("http://localhost:5173");
    });
}
else
{
    // Serve the built SPA (copied into wwwroot on publish) for client-side routes.
    app.MapFallbackToFile("index.html");
}

app.Run();