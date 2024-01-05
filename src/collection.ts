interface Query {
  $or?: { [key: string]: any }[];
  [key: string]: any;
}

interface FindOptions {
  sort?: { [key: string]: 1 | -1 };
  limit?: number;
}
export class Collection {
  data: any[];

  constructor(data: any[] = []) {
    this.data = data;
  }

  async find(query: Query = {}, options: FindOptions = {}): Promise<any[]> {
    let filteredData = this.data;

    for (const key in query) {
      if (query.hasOwnProperty("$or") && Array.isArray(query.$or)) {
        filteredData = filteredData.filter((item) => {
          return query.$or?.some((condition) => {
            return Object.keys(condition).every((key) => {
              return item.hasOwnProperty(key) && item[key] === condition[key];
            });
          });
        });
      } else {
        for (const key in query) {
          if (query.hasOwnProperty(key) && key !== "$or") {
            const value = query[key];
            if (typeof value === "object" && value !== null) {
              if (value["$gte"] !== undefined) {
                filteredData = filteredData.filter(
                  (item) => item[key] >= value["$gte"]
                );
              } else {
                filteredData = filteredData.filter(
                  (item) => item[key] === value
                );
              }
            } else {
              filteredData = filteredData.filter((item) => item[key] === value);
            }
          }
        }
      }
    }

    if (options.sort) {
      filteredData.sort((a, b) => {
        for (const key in options.sort) {
          if (a[key] !== b[key]) {
            if (typeof a[key] === "number" && typeof b[key] === "number") {
              return options.sort[key] === 1
                ? a[key] - b[key]
                : b[key] - a[key];
            } else if (
              typeof a[key] === "string" &&
              typeof b[key] === "string"
            ) {
              return options.sort[key] === 1
                ? a[key].localeCompare(b[key])
                : b[key].localeCompare(a[key]);
            }
          }
        }
        return 0;
      });
    }

    if (options.limit) {
      filteredData = filteredData.slice(0, options.limit);
    }

    return filteredData;
  }
}
