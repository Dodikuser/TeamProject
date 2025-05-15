using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class MyDbContext : DbContext
    {
        public MyDbContext() { }

        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options) { }
        public MyDbContext(DbContextOptions<MyDbContext> options, string connectionString)
            : base(options) { }

        public virtual DbSet<AdHashtag> AdHashtags { get; set; }
        public virtual DbSet<Favorite> Favorites { get; set; }
        public virtual DbSet<Hashtag> Hashtags { get; set; }
        public virtual DbSet<History> Histories { get; set; }
        public virtual DbSet<Place> Places { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<Search> Searches { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.Name);
                entity.Property(e => e.Email);
                entity.Property(e => e.PasswordHash);
                entity.Property(e => e.GoogleId);
                entity.Property(e => e.FacebookId);
                entity.Property(e => e.CreatedAt);
                entity.Property(e => e.OauthProvider);
                entity.Property(e => e.SearchHistoryOn).HasDefaultValue(true);
                entity.Property(e => e.VisitHistoryOn).HasDefaultValue(true);

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.GoogleId).IsUnique();
                entity.HasIndex(e => e.FacebookId).IsUnique();
            });

            modelBuilder.Entity<Search>(entity =>
            {
                entity.HasKey(e => e.SearchId);

                entity.Property(e => e.Text);
                entity.Property(e => e.SearchDateTime).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => e.UserId);
                //entity.Property(e => e.UserId);

                entity.HasOne(s => s.User).WithMany(u => u.Searches).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.ReviewId);

                entity.Property(e => e.Text);
                entity.Property(e => e.Stars);
                entity.Property(e => e.ReviewDateTime).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.PlaceId);
                entity.HasIndex(e => new { e.UserId, e.PlaceId }).IsUnique();

                entity.HasOne(r => r.Place)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(r => r.PlaceId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            modelBuilder.Entity<History>(entity =>
            {
                entity.HasKey(e => e.HistoryId);

                entity.Property(e => e.VisitDateTime).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.IsFromRecs);

                entity.HasIndex(e => e.UserId);
                //entity.Property(e => e.UserId);

                entity.HasIndex(e => e.PlaceId);
                //entity.Property(e => e.PlaceId);

                entity.HasOne(h => h.User)
                    .WithMany(u => u.Histories)
                    .HasForeignKey(h => h.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(h => h.Place)
                    .WithMany(p => p.Histories)
                    .HasForeignKey(h => h.PlaceId)
                    .OnDelete(DeleteBehavior.Cascade);

            });

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.FavoritesId);

                entity.Property(e => e.FavoritedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => e.UserId);
                //entity.Property(e => e.UserId);

                entity.HasIndex(e => e.PlaceId);
                //entity.Property(e => e.PlaceId);

                entity.HasIndex(e => new { e.UserId, e.PlaceId }).IsUnique();

                entity.HasOne(f => f.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Place)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(f => f.PlaceId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Place>(entity =>
            {
                entity.HasKey(e => e.PlaceId);

                entity.Property(e => e.Name);
                entity.Property(e => e.Description);
                entity.Property(e => e.Site);
                entity.Property(e => e.PhoneNumber);
                entity.Property(e => e.Email);
                entity.Property(e => e.Radius);
                entity.Property(e => e.TokensAvailable);
                entity.Property(e => e.LastPromotionDateTime).IsRequired(false);
                entity.Property(e => e.GmapsPlaceId);
                entity.HasIndex(e => e.GmapsPlaceId);

                entity.HasIndex(e => e.UserId);
                //entity.Property(e => e.UserId);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.Places)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasKey(e => e.PhotoId);

                entity.Property(e => e.Path);

                entity.HasIndex(e => e.PlaceId);
                //entity.Property(e => e.PlaceId);

                entity.HasOne(ph => ph.Place)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(ph => ph.PlaceId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Hashtag>(entity =>
            {
                entity.HasKey(e => e.HashtagId);

                entity.Property(e => e.Tag);
                entity.Property(e => e.Price);
            });

            modelBuilder.Entity<AdHashtag>(entity =>
            {
                entity.HasKey(e => new { e.PlaceId, e.HashtagId });

                entity.Property(e => e.PromotionCount);

                entity.HasIndex(e => e.PlaceId);
                entity.HasIndex(e => e.HashtagId);

                entity.HasOne(a => a.Place)
                    .WithMany(p => p.AdHashtags)
                    .HasForeignKey(a => a.PlaceId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(a => a.Hashtag)
                    .WithMany(h => h.AdHashtags)
                    .HasForeignKey(a => a.HashtagId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}
