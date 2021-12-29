module edvl {
    interface DummyServiceInterface {
        greeting: string
        initialGreeting: string
    }
    export class DummyService implements DummyServiceInterface {
        greeting: string;
        initialGreeting: string;

        public static $inject = ["$location"]
        constructor(_: ng.ILocationService) {
            this.greeting = ""
            this.initialGreeting = "hola..."
        }
        public getGreeting(): string {
            return this.greeting + "!"
        }
        public setGreeting(greeting: string): void  {
            this.greeting = greeting
        }
    }
}

export default edvl.DummyService