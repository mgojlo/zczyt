import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { reviews } from '$lib/server/db/schema';
import { ReviewModel, BookModel } from '$lib/server/models';
import { canRemoveReviews } from '$lib/server/util/roles';
import {
	parseIntParam,
	requireAuth,
	requireAuthAction
} from '$lib/server/util/helpers';

export class ReviewController {
	static async listLatest() {
		const latestReviews = await ReviewModel.getWithContext();

		return {
			reviews: latestReviews
		};
	}

	static async listByBook(params: { id?: string }) {
		const bookId = parseIntParam(params.id);

		const bookReviews = await ReviewModel.getWithContext(
			bookId ? eq(reviews.bookId, bookId) : undefined
		);

		return {
			reviews: bookReviews
		};
	}

	static async listByUser(params: { id?: string }) {
		const userId = parseIntParam(params.id);
		if (!userId) throw redirect(303, '/books');

		const { UserModel } = await import('$lib/server/models');
		const user = await UserModel.getSummaryById(userId);
		if (!user) throw redirect(303, '/books');

		const userReviews = await ReviewModel.getByUserId(userId);

		return {
			profileUser: user,
			reviews: userReviews
		};
	}

	static async loadReview(params: { id?: string }) {
		const reviewId = parseIntParam(params.id);
		if (!reviewId) throw redirect(303, '/books');

		const [reviewData] = await ReviewModel.getWithContext(
			eq(reviews.id, reviewId),
			1
		);

		return {
			review: reviewData.review,
			book: reviewData.book,
			reviewUser: reviewData.user
		};
	}

	static async loadReviewForm(locals: App.Locals, params: { id?: string }) {
		const user = requireAuth(locals);

		const bookId = parseIntParam(params.id);
		if (!bookId) throw redirect(303, '/books');

		const book = await BookModel.getById(bookId);
		if (!book) throw redirect(303, '/books');

		return {
			book,
			user,
			existingReview: await ReviewModel.getExisting(bookId, user.id)
		};
	}

	static async submitReview(locals: App.Locals, params: { id?: string }, formData: FormData) {
		const user = requireAuthAction(locals);

		const bookId = parseIntParam(params.id);
		if (!bookId) throw fail(400, { error: 'Nieprawidłowe ID książki' });

		const comment = String(formData.get('comment') ?? '').trim();
		const rating = parseInt(String(formData.get('rating') ?? ''));

		if (!comment) {
			return fail(400, { comment, rating, error: 'Komentarz jest wymagany' });
		}

		if (comment.length > 250) {
			return fail(400, {
				comment,
				rating,
				error: 'Komentarz musi mieć maksymalnie 250 znaków'
			});
		}

		if (isNaN(rating) || rating < 1 || rating > 10) {
			return fail(400, {
				comment,
				rating,
				error: 'Ocena musi być w zakresie od 1 do 10'
			});
		}

		const existingReview = await ReviewModel.getExisting(bookId, user.id);

		if (existingReview) {
			if (user.id !== existingReview.userId && !canRemoveReviews(user.role)) {
				throw fail(403, { error: 'Brak uprawnień do edycji recenzji.' });
			}
			await ReviewModel.update(existingReview.id, {
				comment,
				rating,
				createdAt: new Date()
			});
		} else {
			await ReviewModel.create({
				bookId,
				userId: user.id,
				comment,
				rating
			});
		}

		throw redirect(303, '/books');
	}

	static async deleteReview(locals: App.Locals, params: { id?: string }) {
		const user = requireAuthAction(locals);

		if (!canRemoveReviews(user.role)) {
			throw fail(403, { error: 'Brak uprawnień do usuwania recenzji.' });
		}

		const reviewId = parseIntParam(params.id);
		if (!reviewId) throw fail(400, { error: 'Nieprawidłowe ID recenzji' });

		await ReviewModel.delete(reviewId);

		throw redirect(303, '/reviews');
	}
}
