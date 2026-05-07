//prob1
function filterEvenNumbers<T extends number>(numbers: T[]): T[] {
  return numbers.filter((number) => number % 2 === 0);
}



//prob2
const reverseString = (str: string): string =>
  str.split("").reverse().join("");



//prob3
type StringOrNumber = string | number ;
function checkType(value: StringOrNumber): "String" | "Number" {
  if (typeof value === "string") return "String";
  return "Number";
}




// Prob4
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}




// Prob5
interface Book {
  title: string;
  author: string;
  publishedYear: number;
}

function toggleReadStatus(book: Book): Book & { isRead: boolean } {
  return { ...book, isRead: true };
}




// Prob6
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Student extends Person {
  grade: string;

  constructor(name: string, age: number, grade: string) {
    super(name, age);
    this.grade = grade;
  }

  getDetails(): string {
    return `Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
  }
}




// Prob7

function getIntersection(arr1: number[], arr2: number[]): number[] {
  const set = new Set(arr2);
  return arr1.filter((n) => set.has(n));
}
