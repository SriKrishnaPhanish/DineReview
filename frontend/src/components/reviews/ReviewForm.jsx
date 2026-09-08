import { useState } from "react";

function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");

  const handleCommentChange = (event) => {
    const value = event.target.value;

    setComment(value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (rating === 0 || loading) {
      return;
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length > 500) {
      setError("Comment must not exceed 500 characters");
      return;
    }

    setError("");

    onSubmit({
      rating,
      comment: trimmedComment,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>

      {/* Rating */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-gray-700">Rating</p>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              disabled={loading}
              aria-label={`Rate ${star} out of 5`}
              className={`text-3xl transition ${
                loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              } ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="mt-1 text-sm text-gray-500">{rating} out of 5</p>
        )}

        {rating === 0 && (
          <p className="mt-1 text-sm text-red-500">Please select a rating</p>
        )}
      </div>

      {/* Comment */}
      <div className="mt-5">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Comment
        </label>

        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience..."
          rows="4"
          maxLength="500"
          disabled={loading}
          className={`w-full resize-none rounded-lg border px-4 py-3 outline-none transition ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          } disabled:cursor-not-allowed disabled:bg-gray-100`}
        />

        <div className="mt-1 flex justify-between">
          {error ? <p className="text-sm text-red-500">{error}</p> : <span />}

          <span className="text-xs text-gray-400">{comment.length}/500</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition ${
          rating === 0 || loading
            ? "cursor-not-allowed bg-blue-400"
            : "cursor-pointer bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
        )}

        <span>{loading ? "Submitting..." : "Submit Review"}</span>
      </button>
    </div>
  );
}

export default ReviewForm;
