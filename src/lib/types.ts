export interface BookView {
	id: number;
	title: string;
	author: string;
	originalTitle: string | null;
	externalLink: string | null;
}

export interface ReviewView {
	id: number;
	bookId: number;
	userId: number;
	comment: string;
	rating: number;
	createdAt: Date;
}

export interface UserSummary {
	id: number;
	displayName: string;
}

export interface ReviewWithBook {
	review: ReviewView;
	book: BookView;
}

export interface ReviewWithContext extends ReviewWithBook {
	user: UserSummary;
}
