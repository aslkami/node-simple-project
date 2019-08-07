const lib = require('./lib.js');
const db = require('./db.js');
const mail = require('./mail.js');

// 测试数值
describe("测试数值", () => {
  // use it or test method
  it("1", () => {
    const result = lib.absolute(1)
    expect(result).toBe(1)
  })

  it("-1", () => {
    const result = lib.absolute(-1)
    expect(result).toBe(1)
  })

  it("0", () => {
    const result = lib.absolute(0)
    expect(result).toBe(0)
  })
})

// 测试字符串
describe("测试字符串", () => {
  it("greet", () => {
    const result = lib.greet("Saber")
    expect(result).toMatch(/saber/i)
    expect(result).toContain("Saber")
  })
})

// 测试数组
describe("测试数组", () => {
  it("getCurrencies", () => {
    const result = lib.getCurrencies()

    // too general 太笼统
    expect(result).toBeDefined()
    expect(result).not.toBeNull()

    // too specific 太确切
    expect(result[0]).toBe("USD")
    expect(result[1]).toBe("AUD")
    expect(result[2]).toBe("EUR")
    expect(result.length).toBe(3)

    // proper way 稍微好点的方式
    expect(result).toContain("USD")
    expect(result).toContain("AUD")
    expect(result).toContain("EUR")

    // Ideal way 理想的方式
    expect(result).toEqual(expect.arrayContaining(["USD", "AUD", "EUR"]))
  })
})


// 测试对象
describe("测试对象", () => {
  it("getProduct", () => {
    const result = lib.getProduct(1)
    // expect(result).toBe({ id: 1, price: 10 }) // 两个不同的对象比较，所以测试不通过
    expect(result).toEqual({ id: 1, price: 10 }) // 只比较数值，不比较地址引用
    expect(result).toMatchObject({ id: 1, price: 10 }) // 测试包含这 2 个属性即为通过
    expect(result).toHaveProperty("id", 1) // 严格比较对象里是否有个属性 id = 1， 会比较类型 1 而不是 '1'
  })
})

describe('测试异常错误', () => {
  // 测试 username 无效的情况
  it("username is falsy", () => {
    // const result = lib.registerUser(null)
    // expect(result).toThrow() // 上面的result 没有得到返回值所以没意义
    const args = [null, undefined, '', 0, false, NaN]
    args.forEach(arg => {
      expect(() => { lib.registerUser(arg) }).toThrow()
    })
  })

  // 测试返回值 object
  it('object', () => {
    const result = lib.registerUser('saber')
    expect(result).toMatchObject({ username: 'saber'})
    expect(result.id).toBeGreaterThan(0)
  })
})


// 模拟获取外部数据，重写函数
describe('模拟外部取数据测试', () => {
  it('如果金额大于10打9折', () => {
    db.getCustomerSync = function(customerId) {
      console.log('Fake reading customer...');
      return { id: customerId, points: 20 }
    }
    const order = { customerId: 1,  totalPrice: 10 }
    lib.applyDiscount(order)
    expect(order.totalPrice).toBe(9)
  })
})

// 测试发邮件
describe('测试发邮件', () => {
  // const mockFunction = jest.fn()
  // mockFunction.mockReturnValue(1)
  // mockFunction.mockResolvedValue(1)
  // mockFunction.mockRejectedValue(new Error('...'))

  // 模拟 notifyCustomer 里调用 getCustomerSync方法， 只要有返回值即可
  db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' }) 
  mail.send = jest.fn()
  lib.notifyCustomer({ customerId: 1})
  expect(mail.send).toHaveBeenCalled() // 判断是否被调用
  // expect(mail.send).toHaveBeenCalledWith('a', 'Your order was placed successfully.') // 传参用法
  expect(mail.send.mock.calls[0][0]).toBe("a") // 如果要验证参数 上面的返回值必须和 原函数一样
  expect(mail.send.mock.calls[0][1]).toMatch(/order/) // 测试原函数的第二个参数

})