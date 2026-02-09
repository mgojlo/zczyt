import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import argon2 from 'argon2';
import { db } from '$lib/server/db';
import { users, books, reviews } from '$lib/server/db/schema';

const FIRST_NAMES = [
	'Anna', 'Jan', 'Katarzyna', 'Piotr', 'Maria', 'Tomasz', 'Agnieszka',
	'Krzysztof', 'Magdalena', 'Andrzej', 'Aleksandra', 'Michał', 'Joanna',
	'Marcin', 'Barbara', 'Łukasz', 'Ewa', 'Paweł', 'Monika', 'Adam'
];

const LAST_NAMES = [
	'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński',
	'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski',
	'Kozłowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski',
	'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski'
];

const LOREM_SENTENCES = [
	'Książka bardzo wciągająca, nie mogłem się oderwać.',
	'Fabuła prowadzona w interesujący sposób, choć zakończenie trochę rozczarowuje.',
	'Autor świetnie buduje napięcie i utrzymuje czytelnika w niepewności.',
	'Postacie są dobrze zarysowane, a dialogi brzmią naturalnie.',
	'Lektura obowiązkowa dla każdego miłośnika gatunku.',
	'Niestety, książka nie spełniła moich oczekiwań.',
	'Doskonały styl pisarski, każde zdanie ma znaczenie.',
	'Historia porusza ważne tematy w przystępny sposób.',
	'Akcja toczy się w wartkim tempie, nie ma ani chwili nudy.',
	'Świetnie odwzorowana atmosfera epoki, czuć kunszt autora.',
	'Trochę za długa, ale ogólnie warta uwagi.',
	'Ciekawa konstrukcja narracyjna, łączy wiele wątków w spójną całość.',
	'Polecam szczególnie osobom szukającym ambitnej literatury.',
	'Zaskakujące zwroty akcji trzymają w napięciu do ostatniej strony.',
	'Język prosty i zrozumiały, idealna lektura na wieczór.',
	'Można tu znaleźć wiele uniwersalnych prawd o ludzkiej naturze.',
	'Rewelacyjna pozycja, jedna z lepszych jakie czytałem w tym roku.',
	'Świat przedstawiony jest bogaty i pełen detali.',
	'Fabuła momentami się ciągnie, ale puenta wynagradza cierpliwość.',
	'Książka zmusza do refleksji, długo o niej myślałem po przeczytaniu.',
];

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateReview(): string {
	const count = randomInt(2, 4);
	const sentences: string[] = [];
	const used = new Set<number>();
	while (sentences.length < count) {
		const idx = Math.floor(Math.random() * LOREM_SENTENCES.length);
		if (!used.has(idx)) {
			used.add(idx);
			sentences.push(LOREM_SENTENCES[idx]);
		}
	}
	return sentences.join(' ');
}

function oneWeekAgo(): Date {
	const d = new Date();
	d.setDate(d.getDate() - 7);
	return d;
}

// ── Actions ──────────────────────────────────────────────────

const USER_COUNT = 10;
const REVIEWS_PER_USER = 3;
const SEED_PASSWORD = 'password123';

export const actions: Actions = {
	default: async () => {
		const allBooks = await db.select({ id: books.id }).from(books);
		if (allBooks.length === 0) {
			return fail(400, { error: 'Brak książek w bazie danych. Najpierw dodaj książki.' });
		}

		const hashedPassword = await argon2.hash(SEED_PASSWORD, { type: argon2.argon2id });
		const createdAt = oneWeekAgo();
		const createdUsers: string[] = [];
		let totalReviews = 0;

		for (let i = 0; i < USER_COUNT; i++) {
			const firstName = pick(FIRST_NAMES);
			const lastName = pick(LAST_NAMES);
			const suffix = randomInt(10, 99);
			const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${suffix}`;
			const displayName = `${firstName} ${lastName}`;

			// Create user
			let userId: number;
			try {
				const [inserted] = await db
					.insert(users)
					.values({
						username,
						displayName,
						password: hashedPassword,
						role: 'verified'
					})
					.returning({ id: users.id });
				userId = inserted.id;
			} catch {
				continue;
			}

			createdUsers.push(displayName);

			const bookIds = allBooks.map((b) => b.id);
			const reviewCount = Math.min(REVIEWS_PER_USER, bookIds.length);
			const chosenBooks = new Set<number>();
			while (chosenBooks.size < reviewCount) {
				chosenBooks.add(pick(bookIds));
			}

			for (const bookId of chosenBooks) {
				await db.insert(reviews).values({
					bookId,
					userId,
					comment: generateReview(),
					rating: randomInt(1, 10),
					createdAt
				});
				totalReviews++;
			}
		}

		return {
			success: true,
			message: `Utworzono ${createdUsers.length} użytkowników i ${totalReviews} recenzji.`,
			users: createdUsers
		};
	}
};
