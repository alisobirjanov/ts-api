import bcrypt from 'bcryptjs';

export class User {
	private _password: string;
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		hashPassword?: string,
	) {
		if (hashPassword) {
			this._password = hashPassword;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}
	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await bcrypt.hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return bcrypt.compare(pass, this.password);
	}
}
