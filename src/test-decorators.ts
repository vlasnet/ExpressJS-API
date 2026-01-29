type Constructor<T = object> = new (...args: any[]) => T;

function Component(id: number) {
	console.log('init Component');

	return function <T extends Constructor>(
		target: T,
	): new (...args: ConstructorParameters<T>) => InstanceType<T> & { id: number } {
		console.log('return Component class');

		const Result = class extends target {
			id: number = id;
		};

		return Result as unknown as new (
			...args: ConstructorParameters<T>
		) => InstanceType<T> & { id: number };
	};
}

function Logger() {
	console.log('init Logger');

	return function <T extends Constructor>(target: T): T {
		console.log('return Logger class');
		return class extends target {} as T;
	};
}

function Method(target: object, propertyKey: string, propertyDescriptor: PropertyDescriptor): void {
	console.log(propertyKey);
	propertyDescriptor.value = function (...args: unknown[]): number | undefined {
		if (typeof args[0] === 'number') {
			return args[0] * 10;
		}
	};
}

function Prop(target: object, propertyKey: string): void {
	let value: number;
	console.log('!propertyKey!', propertyKey);

	const getter = (): number => {
		console.log('Getter');
		return value;
	};

	const setter = (newValue: number): void => {
		console.log('Setter');
		value = newValue;
	};

	Object.defineProperty(target, propertyKey, { get: getter, set: setter });
}

function Param(target: object, propertyKey: string, index: number): void {
	console.log('Param ===>', propertyKey, index);
}

@Logger()
@Component(50)
export class User {
	@Prop
	declare id: number;

	@Method
	updateId(@Param newId: number): number {
		this.id = newId;
		return this.id;
	}
}

console.log(new User().id);
console.log(new User().updateId(20));
