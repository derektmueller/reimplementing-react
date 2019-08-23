const path = require("path");

describe('helloReact', () => {
  beforeAll(async () => {
    const url = 
      `file://${path.resolve(__dirname, './helloReact.html')}`;
    await page.goto(url)
  })

  it('displays page rendered by React', async () => {
    await expect(page).toMatch('hello react')
  })
})
