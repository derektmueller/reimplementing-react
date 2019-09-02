const path = require("path");

describe('static content', () => {
  beforeAll(async () => {
    const url = 
      `file://${path.resolve(__dirname, './index.html')}`;
    await page.goto(url)
  })

  it('displays page rendered by React', async () => {
    await expect(page).toMatch('Count: 0')
    await expect(page).toClick('button', { text: '+' })
    await expect(page).toMatch('Count: 1')
    await expect(page).toClick('button', { text: '+' })
    await expect(page).toMatch('Count: 2')
    await expect(page).toClick('button', { text: '+' })
    await expect(page).toMatch('Count: 3')
    await expect(page).toClick('button', { text: '-' })
    await expect(page).toMatch('Count: 2')
    await expect(page).toClick('button', { text: '-' })
    await expect(page).toMatch('Count: 1')
    await expect(page).toClick('button', { text: '-' })
    await expect(page).toMatch('Count: 0')
  })
})
