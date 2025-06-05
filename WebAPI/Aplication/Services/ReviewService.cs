using Application.DTOs;
using Entities.Enums;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class ReviewService(ReviewRepository _reviewRepository, PhotoRepository _photoRepository, PlaceRepository _placeRepository)
    {
        public async Task AddAsync(ReviewDTO DTO)
        {
            ulong Id = (await _placeRepository.GetByIdGmapsPlaceId(DTO.GmapId))!.Id;
            Review result = new Review()
            {
                Text = DTO.Text,
                Price = DTO.Price,
                Quality = DTO.Quality,
                Congestion = DTO.Congestion,
                Location = DTO.Location,
                Infrastructure = DTO.Infrastructure,
                Stars = DTO.Stars,
                ReviewDateTime = DateTime.Now,
                PlaceId = Id,
                UserId = DTO.UserId
            };
            await _reviewRepository.AddAsync(result);
            await _placeRepository.SetStarsAsync(Id, await _reviewRepository.GetAvgStarsAsync(Id));

        }

        public async Task<ReviewOperationResult> EditAsync(ReviewDTO DTO, ulong reviewId, ulong userId)
        {
            Review? original = await _reviewRepository.FindAsync(reviewId);
            if (original == null) return ReviewOperationResult.NotFound;

            if (original.UserId != userId) return ReviewOperationResult.AccessDenied;
            ulong Id = (await _placeRepository.GetByIdGmapsPlaceId(DTO.GmapId))!.Id;
            Review result = new Review()
            {
                Id = original.Id,
                Text = DTO.Text,
                Price = DTO.Price,
                Quality = DTO.Quality,
                Congestion = DTO.Congestion,
                Location = DTO.Location,
                Infrastructure = DTO.Infrastructure,
                Stars = DTO.Stars,
            };

            await _reviewRepository.Update(result);
            await _placeRepository.SetStarsAsync(Id, await _reviewRepository.GetAvgStarsAsync(Id));
            return ReviewOperationResult.Success;
        }

        public async Task<List<ReviewDTO>> GetAsync(string placeId, int skip, int take)
        {
            ulong Id = (await _placeRepository.GetIdByGmapsPlaceIdAsync(placeId)).Value;
            List<Review> rawReviews = await _reviewRepository.GetReviewsPagedAsync(Id, skip, take);
            List<Photo> photos = await _photoRepository.GetFirstAsync(rawReviews.Select(r => r.Id).ToList());
            List<ReviewDTO> reviewDTOs = new List<ReviewDTO>();
            foreach (var review in rawReviews)
            {
                Photo photo = photos.FirstOrDefault(p => p.PlaceId == review.PlaceId);
                reviewDTOs.Add(new ReviewDTO()
                {
                    Text = review.Text,
                    Price = review.Price,
                    Quality = review.Quality,
                    Congestion = review.Congestion,
                    Location = review.Location,
                    Infrastructure = review.Infrastructure,
                    Stars = review.Stars,
                    ReviewDateTime = DateTime.Now,
                    PlaceId = review.PlaceId,
                    UserId = review.UserId,
                    UserName = review.User.Name,
                    Photo = new PhotoDTO()
                    {
                        PlaceId = review.PlaceId,
                        Path = photo == null ? "" : photo.Path,
                        Id = photo == null ? 0 : photo.Id,
                    }
                });
            }
            return reviewDTOs;
        }
        public async Task<List<ReviewDTO>> GetByUserAsync(ulong userId, int skip, int take)
        {
            List<Review> rawReviews = await _reviewRepository.GetByUserAsync(userId, skip, take);
            List<Photo> photos = await _photoRepository.GetFirstAsync(rawReviews.Select(r => r.Id).ToList());
            List<ReviewDTO> reviewDTOs = new List<ReviewDTO>();
            foreach (var review in rawReviews)
            {
                Photo photo = photos.FirstOrDefault(p => p.PlaceId == review.PlaceId);
                reviewDTOs.Add(new ReviewDTO()
                {
                    Text = review.Text,
                    Price = review.Price,
                    Quality = review.Quality,
                    Congestion = review.Congestion,
                    Location = review.Location,
                    Infrastructure = review.Infrastructure,
                    Stars = review.Stars,
                    ReviewDateTime = DateTime.Now,
                    PlaceId = review.PlaceId,
                    GmapId = (await _placeRepository.GetByIdAsync(review.PlaceId)).GmapsPlaceId,
                    UserId = review.UserId,
                    UserName = review.User.Name,
                    Photo = new PhotoDTO()
                    {
                        PlaceId = review.PlaceId,
                        Path = photo == null ? "" : photo.Path,
                        Id = photo == null ? 0 : photo.Id
                    }
                });
            }
            return reviewDTOs;
        }

        public async Task<ReviewOperationResult> RemoveAsync(ulong reviewId, ulong userId)
        {
            Review? review = await _reviewRepository.FindAsync(reviewId);
            if (review == null) return ReviewOperationResult.NotFound;

            if (review.UserId != userId) return ReviewOperationResult.AccessDenied;

            await _reviewRepository.RemoveAsync(review);
            await _placeRepository.SetStarsAsync(review.PlaceId, await _reviewRepository.GetAvgStarsAsync(review.PlaceId));
            return ReviewOperationResult.Success;
        }
    }
}
