interface Subjects {
	total: number;
	subjects: Subject[];
}

/**
 * @example class_code = INT3121 20, INT3132 20, INT3407E 20
 * @example room = 205-GĐ3, PM307-G2, PM304-G2
 * @example day = 3, (T3), 4 (T4), 6 (T6)
 * @example from_lesson = 3 (Tiết 3), 6 (Tiết 6), ...
 * @example to_lesson = 5 (Tiết 5), 10 (Tiết 10)
 */
interface Subject {
	name: string;
	class_code: string;
	room: string;
	day: number;
	from_lesson: number;
	to_lesson: number;
	lecturer?: string;
}
