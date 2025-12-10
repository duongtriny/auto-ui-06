import test, { expect, Page } from "@playwright/test";
import { ratingData } from "./rating-data";

for (let data of ratingData) {
    test(`Verify select rating ${data.ratingNumber}`, async ({ page }) => {
        await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/rating');
        await selectRatingByLabel('Rate', data.ratingNumber, page)
        await expect(page.getByText(`Current rating: ${data.ratingText}`).first()).toBeVisible();
    });
}

async function selectRatingByLabel(label: string, rating: number, page: Page) {
    let ratingGroupXpath = `(//div[normalize-space()="${label}"]/following::ul[@role="radiogroup"])[1]`;
    let ratingGroupLocator = page.locator(ratingGroupXpath);
    let currentRating = (await ratingGroupLocator.locator('//div[@aria-checked="true"]').all()).length;
    if (currentRating != rating) {
        let xpath = `//li[${rating}]//div[@role="radio"]`;
        await ratingGroupLocator.locator(xpath).click();
    }
}

test(`Verify select half rating`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/rating');
    await selectHalfRatingByLabel('Haft Rate', 2.5, page);
    await expect(page.getByText(`Current rating: 2.5`).first()).toBeVisible();
});

async function selectHalfRatingByLabel(label: string, rating: number, page: Page) {
    let ratingGroupXpath = `(//div[normalize-space()="${label}"]/following::ul[@role="radiogroup"])[1]`;
    let ratingGroupLocator = page.locator(ratingGroupXpath);
    let currentFullRating = (await ratingGroupLocator.locator("//li[contains(concat(' ',normalize-space(@class),' '),' ant-rate-star-full ')]").all()).length;
    let currentHalfRating = (await ratingGroupLocator.locator("//li[contains(concat(' ',normalize-space(@class),' '),' ant-rate-star-half ')]").all()).length;
    currentFullRating = currentHalfRating > 0 ? currentFullRating + 0.5 : currentFullRating;
    if (rating != currentFullRating) {
        let xpath;
        if (Number.isInteger(rating)) {
            xpath = `//li[${rating}]//div[contains(concat(' ',normalize-space(@class),' '),' ant-rate-star-second ')]`;

        } else {
            xpath = `//li[${rating + 0.5}]//div[contains(concat(' ',normalize-space(@class),' '),' ant-rate-star-first ')]`;
        }
        await ratingGroupLocator.locator(xpath).click();
    }

}