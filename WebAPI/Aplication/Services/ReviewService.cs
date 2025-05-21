using Application.DTOs;
using Entities.Enums;
using Entities.Models;
using Infrastructure.Repository;

namespace Application.Services
{
    public class ReviewService(ReviewRepository _reviewRepository)
    {
        public async Task AddAsync(ReviewDTO DTO)
        {
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
                PlaceId = DTO.PlaceId,
                UserId = DTO.UserId
            };
            await _reviewRepository.AddAsync(result);
        }

        public async Task<ReviewOperationResult> EditAsync(ReviewDTO DTO, ulong reviewId, ulong userId)
        {
            Review? original = await _reviewRepository.FindAsync(reviewId);
            if (original == null) return ReviewOperationResult.NotFound;

            if (original.UserId != userId) return ReviewOperationResult.AccessDenied;

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
            return ReviewOperationResult.Success;
        }

        public async Task<List<ReviewDTO>> GetAsync(ulong placeId, int skip, int take)
        {
            List<Review> rawReviews = await _reviewRepository.GetReviewsPagedAsync(placeId, skip, take);
            List<ReviewDTO> reviewDTOs = new List<ReviewDTO>();
            foreach (var review in rawReviews)
            {
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
            return ReviewOperationResult.Success;
        }
    }
}
