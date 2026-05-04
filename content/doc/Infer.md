# Infer

## Infer基本使用
- 言简意赅，infer就是推导泛型参数
- infer声明只能出现在extends子语句中
```ts
interface User {
    name:string
    age:number
}
type Result = Promise<User>
type PromiseRes<T> = T extends Promise<infer R> ? R : never
type r = PromiseRes<Result>
```
- 如果遇到多层的情况可以使用递归
```ts
interface User {
    name:string
    age:number
}
type Result = Promise<User>
type PromiseRes<T> = T extends Promise<infer R> ? R : never
type r = PromiseRes<Result>
```

## Infer例子
- 提取头部元素
```ts
type Arr = ['a','b','c']
type First<T extends any[]> = T extends [infer F.irst,...any[]] ? First : []
type a = First<Arr>
```
- 提取尾部元素
```ts
type Arr = ['a', 'b', 'c']
type Last<T extends any[]> = T extends [...any[],infer Last,] ? Last : []
type C = Last<Arr>
```
- Infer 递归
```ts
// 现在有一个类型type Arr = [1,2,3,4] 希望通过一个ts工具变成 type Arr = [4,3,2,1]
type Arr = [1, 2, 3, 4]
type ReveArr<T extends any[]> = T extends [inferFirst, ...infer rest] ? [...ReveArr<rest>, First]:T
type Res = ReveArr<Arr>
```