# 装饰器

## 类装饰器
- 普通类装饰器
```ts
const Base: ClassDecorator = (target) => {
    // target返回的是构造函数
    target.prototype.xiaotng = name
    target.prototype.fn = () => {
        console.log('我是th')
    }
}

@Base
class Http {

}

const http = new Http()
```

- 装饰器工厂
```ts
// 假设想给Base传递参数 @Base('123') 这时候就可以采用函数柯里化的写法
@Base
class Http {

}

const Base = (key: string) => {
    const fn: ClassDecorator = (target) => {
        console.log(target)
    }
}

const Base: ClassDecorator = (target) => {

}
```

## 方法装饰器
```ts
const Get = (url: string) => {
    const fn: MethodDecorator = (target, key, descriptor) => {
        axios.get(url).then(res => {
            descriptor.value(res.data)  //descriptor.value 就是 getList函数
        })
    }
    return fn
}
class Http {
    @Get('https://www.baidu.com') //先执行Get函数
    getList(data: any) {
        conbsole.log(data)
    }
    @Post('https://www.baidu.com')
    create() {

    }
}
```

## 参数装饰器
```ts
const Get = (url: string) => {
    const fn: MethodDecorator = (target, _key, descriptor) => {
        const key = Reflect.getMetaData('key', target)
        axios.get(url).then(res => {
            descriptor.value(key ? res.data[key] : res.data)  //descriptor.value 就是 getList函数
        })
    }
    return fn
}

// Result是优先于Get执行的
const Result = () => {
    const fn: ParameterDecorator = (target, key, index) => {
        Reflect.defineMetadata('key', 'result', targer)
    }
}

class Http {
    @Get('https://www.baidu.com') //先执行Get函数
    getList( @Result data: any) {
        conbsole.log(data)
    }
    @Post('https://www.baidu.com')
    create() {

    }
}
```

## 属性装饰器
```ts
const Name = (target, key) => {
    // target指向对象原型 key是属性名
    console.log(target, key)
}
class Http {
    @Name
    xiaoman: string
    constructor() {
        this.xiaoman = 'xiaoteng'
    }
}
```