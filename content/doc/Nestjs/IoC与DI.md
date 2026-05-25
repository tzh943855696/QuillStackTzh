# Ioc(控制反转)DI(依赖注入)与DAO、DTO

## Nestjs中的MVC
- Nestjs可以通过模版库实现View曾，常见:pug|hus|ejs等
- Nestjs默认继承express作为web服务器，可以换成koa/fastify
- Controller响应前短的请求，Model是对应具体的数据库逻辑

## DAO与DTO
- DTO：数据传输对象（接受部分数据、对数据进行筛选，不对应实体，属性小于等于实体）
- DAO：数据访问对象（对接数据库接口、不暴露数据库的内部信息，对应实体）对于Nestjs来说就是一些ORM框架