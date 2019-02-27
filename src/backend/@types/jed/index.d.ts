declare module 'jed' {
	export class Jed {
		constructor(translations: any);

		gettext(key:string):string;
	}
	export function sprintf(format: string, ...args: any[]): string;
	export default Jed;
}
