import fonts from 'pdfmake/build/vfs_fonts';
import pdfmake from 'pdfmake/build/pdfmake';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import type { IAnswer, IObjective, IQuestion } from '$lib/server/db/schema';

type Question = IQuestion & { answers: IAnswer[] };

const LINE_IMG = `<svg height="1" width="475.28" xmlns="http://www.w3.org/2000/svg">< line x1="0" y1="1" x2="100%" y2="1" style="stroke:black;stroke-width:1" /></svg>`;
const CHECKBOX_IMG = `<svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 21 21"><path d="m2.5.5h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2v-10c0-1.1045695.8954305-2 2-2z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"/></svg>`;

const LINE = (): Content => ({ svg: LINE_IMG, marginTop: 25 });
const CHECKBOX = (): Content => ({ svg: CHECKBOX_IMG, width: 12 });

const question = (pos: number, q: Question): Content => ({ text: `${pos}. ${q.text}`, bold: true });

const short = (pos: number, q: Question): Content => ({
	stack: [question(pos, q), LINE(), LINE()],
	margin: [0, 12]
});

const checkbox = (answer: IAnswer) => ({
	columns: [CHECKBOX(), { text: answer.text, width: '*' }],
	marginBottom: 2,
	marginTop: 3
});

const multiple = (pos: number, q: Question): Content => ({
	stack: [question(pos, q), { stack: q.answers.map((a) => checkbox(a)) }],
	margin: [0, 12]
});

const exercise = (pos: number, q: Question): Content => ({
	stack: [question(pos, q)],
	margin: [0, 15]
});

type Document = TDocumentDefinitions & { content: Content[] };

function shuffle<T>(array: T[]): T[] {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle
	while (currentIndex != 0) {
		// Pick a remaining element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

const generate = (
	objective: IObjective | null,
	questions: Record<number, Question>
): Promise<Blob> => {
	const file: Document = {
		pageSize: 'A4',
		pageMargins: [60, 60, 60, 40],
		content: [
			{ text: `QUIZ DI ${objective?.name.toLocaleUpperCase() ?? 'MATERIE MISTE'}`, style: 'header' }
		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				alignment: 'center',
				marginBottom: 25
			}
		},
		defaultStyle: {
			columnGap: 4
		}
	};

	(<any>pdfmake).addVirtualFileSystem(fonts);

	const data = Object.entries(questions);

	return new Promise((res, rej) => {
		const content = shuffle(data).map(([_, q], i) => {
			if (q.typeId === 1) {
				return multiple(i + 1, q);
			}

			if (q.typeId === 2) {
				return short(i + 1, q);
			}

			return exercise(i + 1, q);
		});

		file.content.push(content);

		const pdf = pdfmake.createPdf(file);
		pdf.getBlob(res);
	});
};

export { generate, LINE, CHECKBOX, question, short, checkbox, multiple, exercise };
