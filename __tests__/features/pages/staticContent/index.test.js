const path = require("path");

describe('static content', () => {
  beforeAll(async () => {
    const url = 
      `file://${path.resolve(__dirname, './index.html')}`;
    await page.goto(url)
  })

  it('displays page rendered by React', async () => {
    await expect(page).toMatch('list header')
    await expect(page).toMatch('item a')
    await expect(page).toMatch('item b')
    await expect(page).toMatch('item c')
    await expect(page).toMatch('item d')
  })
})
