
import { test, expect } from "bun:test";
import { Collection } from "./collection";

type UsersType = {
	_id: string,
	name: string
	age: number
	city: string
}

type UsersCollectionType = UsersType[]

const users: UsersCollectionType = [
	{
		_id: "1",
		name: "Jane",
		age: 28,
		city: "LA"
	},
	{
		_id: "2",
		name: "Angela",
		age: 40,
		city: "Praga"
	},
	{
		_id: "3",
		name: "Crista",
		age: 19,
		city: "Krakow"
	},
	{
		_id: "4",
		name: "Crista",
		age: 56,
		city: "Krakow"
	},
	{
		_id: "5",
		name: "Amanda",
		age: 23,
		city: "Krakow"
	},
	{
		_id: "6",
		name: "Amanda",
		age: 18,
		city: "Krakow"
	},
];

const usersCollection = new Collection(users);
const isDebug = true;
const { log } = console;

test.skipIf(isDebug)("query user by name", async done => {
	const query = {
		name: "Crista"
	};

	const result = await usersCollection
		.find(query) as UsersCollectionType;

	expect(result).toBeArray();
	expect(result[0]._id).toBe("3");
	expect(result[1]._id).toBe("4");

	done();
});

test.skipIf(isDebug)("query user by name and city", async done => {
	const query = {
		name: "Crista",
		age: 19
	};

	const result = await usersCollection
		.find(query) as UsersCollectionType;

	expect(result).toBeArray();
	expect(result[0]._id).toBe("3");
	expect(result).toBeArrayOfSize(1);

	done();
});

test.skipIf(isDebug)("query user by name with limit=1", async done => {
	const query = {
		name: "Crista",
	};

	const options = {
		limit: 1
	};

	const result = await usersCollection
		.find(query, options) as UsersCollectionType;

	expect(result).toBeArray();
	expect(result[0]._id).toBe("3");
	expect(result).toBeArrayOfSize(1);

	done();
});

test.skipIf(isDebug)("query user by name with sort={age: -1}", async done => {
	const query = {
		name: "Crista",
	};

	const options = {
		sort: {
			age: -1
		}
	};

	const result = await usersCollection
		.find(query, options) as UsersCollectionType;

	expect(result).toBeArray();
	expect(result[0]._id).toBe("4");
	expect(result[1]._id).toBe("3");
	expect(result).toBeArrayOfSize(2);

	done();
});

test(
	"query users with sort={age: 1}", 
	async done => {
		done();
	}
);

test.skipIf(isDebug)("query user by query={city: 'Krakow'} and sort={name: -1, age: 1}", async done => {
	const query = {
		city: "Krakow"
	};

	const options = {
		sort: {
			name: -1,
			age: 1
		}
	};

	const result = await usersCollection
		.find(query, options) as UsersCollectionType;

	expect(result).toBeArray();
	expect(result[0]._id).toBe("3"); // Crista 19
	expect(result[1]._id).toBe("4"); // Crista 56
	expect(result[2]._id).toBe("6"); // Amanda 18
	expect(result[3]._id).toBe("5"); // Amanda 23
	expect(result).toBeArrayOfSize(4);

	done();
});

test.skipIf(isDebug)(
	"query user by age={$gte: 40} filter",
	async done => {
		const query = {
			age: {
				$gte: 40
			}
		};

		const result = await usersCollection
			.find(query) as UsersCollectionType;

		expect(result).toBeArray();
		expect(result[0]._id).toBe("2"); // Crista 19
		expect(result[1]._id).toBe("4"); // Crista 56
		expect(result).toBeArrayOfSize(2);

		done();
	});

test.skipIf(isDebug)(
	"query user by $or filter",
	async done => {
		const query = {
			$or: [
				{ age: 28 },
				{ age: 40 }
			]
		};
		const result = await usersCollection
			.find(query) as UsersCollectionType;
		expect(result).toBeArrayOfSize(2);
		expect(result[0]._id).toBe("1");
		expect(result[1]._id).toBe("2");
		done();
	});

test.skipIf(isDebug)(
	"query user by combined filter",
	async done => {
		const query = {
			city: "Krakow", 
			age: {
				$gte: 20
			}
		};
		const result = await usersCollection
			.find(query) as UsersCollectionType;
		expect(result).toBeArrayOfSize(2);
		expect(result[0]._id).toBe("4"); // Amanda 56
		expect(result[1]._id).toBe("5"); // Amanda 23
		done();	
	}
);