function Component( id: number ) {
    console.log('init Component');
    return function <T extends { new( ...args: any[] ): { id: number } }>( target: T ) {
        console.log('return Component class');
        return class extends target {
            constructor( ...args: any[] ) {
                super(...args);
                this.id = id;
            }
        };
    };
}

function Logger() {
    console.log('init Logger');
    return function <T extends { new( ...args: any[] ): {} }>( target: T ) {
        console.log('return Logger class');
        return class extends target {

        };
    };
}

function Method(
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
) {
    console.log(propertyKey);
    propertyDescriptor.value = function ( ...args: unknown[] ) {
        if ( typeof args[0] === 'number' ) {
            return args[0] * 10;
        }
    };
}

function Prop( target: Object, propertyKey: string ) {
    let value: number;
    console.log('!propertyKey!', propertyKey);

    const getter = () => {
        console.log('Getter');
        return value;
    };

    const setter = ( newValue: number ) => {
        console.log('Setter');
        value = newValue;
    };

    Object.defineProperty(target, propertyKey, { get: getter, set: setter });
}

function Param( target: Object, propertyKey: string, index: number ) {
    console.log('Param ===>', propertyKey, index);
}

@Logger()
@Component(50)
export class User {
    @Prop
    declare id: number;

    @Method
    updateId( @Param newId: number ) {
        this.id = newId;
        return this.id;
    }
}

console.log(new User().id);
console.log(new User().updateId(20));

