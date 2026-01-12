import test, { expect, Page } from "@playwright/test";
test(`Verify alert`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/frames');
    let frameXpath = `//iframe[@title='Example Frame']`;
    const iframe = page.locator(frameXpath).contentFrame();
    await iframe.getByText('API Automation Java/JS').click();
    await expect(iframe.getByText('Nâng tầm kỹ năng kiểm thử, chinh phục đỉnh cao sự nghiệp với khóa học API Automation Testing chuyên sâu.')).toBeVisible();
});