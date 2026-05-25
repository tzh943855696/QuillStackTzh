# 泛型工具
- Pick<T>,Partial<T>,Required<T>,Exclude<T>,Omit<T>
```ts
interface User {
    address: string
    name: string
    age: number
}

type test = Pick<User, 'age' | 'name'>
type CustomPick<T, K extends keyof T> = {
    [P in K]:T[P]
}

type test2 = Partial<User>
type CustomPartial<T> = {
    [P in keyof T]?:T[P]
}

type test3 = Required<User>
type CustomRequired<T> = {
    [P in keyof T]-?:T[P]
}

type test4 = Exclude<'a'|'b'|'c', 'a'|'b'> // 'c
type CustomExclude<T, K> = T extends K ? never : T

type test5 = Omit<User, 'name'|'age'> // 'address
type CustomExclude<T, K> = Pick<T,Exclude<keyof T, K>>
```

- Record 与 ReturnType
```ts

let obj: Record<string,any> = {
    name: '123'
}


```
