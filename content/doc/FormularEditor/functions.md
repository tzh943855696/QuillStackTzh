# formular-editor/func 详解

> `func` 包是内置函数的实现仓库，对外导出一批全大写命名的纯函数，供 `eval` 包在执行公式时按名称查找调用。  
> 本包**没有任何主动行为**，完全被动等待调用，不依赖 `eval` 包，不感知公式系统的任何细节。

---

## 与外界的交互方式

### 交互1：被 `eval` 包按名称取用

`eval/calculator/index.ts` 中，翻译公式占位符时会这样使用：

```typescript
import * as FuncLibs from '@ino/formular-editor-func'

// 翻译 ${func.SUM::SUM} 时：
const funcName = "SUM"                         // 从占位符提取，已 toUpperCase()
funcLibs["$func_SUM"] = FuncLibs[funcName]    // 按名字取出函数实现
```

函数名必须**全大写**，因为 `FuncPlaceholder.getValue()` 会对名称执行 `toUpperCase()`，再用作 key 去 `FuncLibs` 里查找。

```
公式占位符 ${func.SUM::SUM}
    ↓ FuncPlaceholder 解析
  keys[0] = "SUM" → toUpperCase() = "SUM"
    ↓
  FuncLibs["SUM"] → SUM 函数实现
    ↓ 注入执行上下文
  parser.evaluate() 中调用 SUM(...)
```

### 交互2：被 `expr-eval` 作为运算符底层实现调用

`expr-eval/src/functions.js` 中，`&&` 和 `||` 运算符的底层直接调用 `func` 包的 `AND`/`OR`：

```javascript
import * as FuncLibs from '@ino/formular-editor-func'
import funcEvalCore from '@ino/formular-editor-func'

// && 运算符的实现
export function andOperator(a, b) {
  funcEvalCore.setRuntime('keyword')  // 标记当前是运算符调用场景
  return FuncLibs.AND(a, b)
}

// || 运算符的实现
export function orOperator(a, b) {
  funcEvalCore.setRuntime('keyword')
  return FuncLibs.OR(a, b)
}
```

---

## `FuncEvalCore` —— 运行时模式控制器

`util/index.ts` 里定义的全局单例，用来区分函数被调用的上下文：

```typescript
class FuncEvalCore {
  runtime: 'keyword' | 'func'  // 默认 'func'

  setRuntime(runtime) { this.runtime = runtime }
  reset() { this.setRuntime('func') }
}

export const funcEvalCore = new FuncEvalCore()
```

| 模式 | 触发场景 | 用途 |
|------|---------|------|
| `'func'`（默认）| 通过 `${func.AND::AND}(...)` 函数调用 | 使用函数调用的原始错误信息 |
| `'keyword'` | 通过 `&&` / `\|\|` 运算符 | 使用运算符语义的友好错误信息 |

**为什么需要这个机制？**

`AND`/`OR` 既能当函数调用，又是 `&&`/`||` 的底层实现，但两种场景的报错信息应该不同：

```typescript
// func/src/logic.ts
export function AND(...args: any[]): boolean {
  try {
    isBool(args, { name: 'AND' })
  } catch(error) {
    if (funcEvalCore.runtime === 'keyword') {
      funcEvalCore.reset()
      throw new Error('与运算的值必须为布尔值')   // 运算符场景的友好提示
    }
    throw error   // 函数调用场景的原始报错
  }
  return args.every(Boolean)
}
```

---

## 参数校验体系（`util/util.ts`）

所有函数调用前进行参数校验，失败立即抛出带明确提示的错误。

### 三个核心校验函数的共同模式

以 `isNumber` 为例：

```typescript
function isNumber(data: any, options?: ICheckOption) {
  // 1. 空值检查
  if (required && 数据为空) throw new Error(`${name}函数参数不能为空`)

  // 2. 支持数组批量检查
  if (Array.isArray(data)) {
    flag = data 中每一项都是数字
  } else {
    flag = typeof data === 'number'
  }

  // 3. 不合法时报错
  if (!flag && options) throw new Error(`${name}函数参数必须为数字`)
}
```

`isString`、`isBool` 遵循相同模式，只是类型判断不同。

### 其他工具函数

| 函数 | 作用 |
|------|------|
| `isNull(val)` | null/undefined/空字符串/空对象/空数组均视为空 |
| `isDate(date)` | 支持 Date/string/number 三种入参的日期有效性检查 |
| `convertToDateObject(date)` | 将三种日期入参统一转为 Date 对象，非法则抛错 |
| `isExistDate(dateStr)` | 日期是否真实存在（如 2月30日返回 false）|
| `isPositiveInt(num)` | 是否为安全正整数 |
| `typeOf(data)` | 精确类型判断，返回 `"date"/"array"/"object"` 等 |
| `setValueByJsonpath` | 按 jsonpath 路径设置嵌套对象的值，支持 `[*]` 通配符 |
| `bigNumbersCondition` | 将表达式中超出安全整数范围的数字转为字符串，防止精度丢失 |

---

## 整体交互示意

```
用户公式: "${func.SUM::SUM}(${field.list::list})"  以及  "A && B"

    ┌─────────────────────────────────────────┐
    │              eval 包                     │
    │                                          │
    │  translator():                           │
    │    FuncLibs["SUM"] ─────────────────────┼──→ func 包（取 SUM 实现）
    │                                          │
    │  expr-eval 运算符:                        │
    │    andOperator(a, b) ───────────────────┼──→ func 包（调用 AND）
    │    orOperator(a, b)  ───────────────────┼──→ func 包（调用 OR）
    └─────────────────────────────────────────┘
                     │
              funcEvalCore  ← 标记运行时模式（func / keyword）
                     │
    ┌────────────────▼────────────────────────┐
    │              func 包                     │
    │  SUM / AND / OR / TODAY / ...            │
    │  纯函数，只管实现，不感知外部系统          │
    └─────────────────────────────────────────┘
```

`func` 包的设计目标是：**可独立测试、可独立发布，未来扩展新函数时无需修改 `eval` 包**。
