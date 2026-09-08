function ReviewCard({ review }) {
  return (
    <div className="border-b border-gray-200 py-5 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {review.reviewer_first_name} {review.reviewer_last_name}
          </h3>

          <div className="mt-1 flex items-center gap-1">
            <span className="text-yellow-500">{"★".repeat(review.rating)}</span>

            <span className="text-sm text-gray-400">{review.rating}/5</span>
          </div>
        </div>

        <span className="text-xs text-gray-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-6 text-gray-600">{review.comment}</p>
      )}
    </div>
  );
}

export default ReviewCard;
