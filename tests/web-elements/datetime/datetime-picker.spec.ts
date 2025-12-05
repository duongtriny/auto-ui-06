import test, { expect, Page } from "@playwright/test";

test(`Verify timepicker`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/date-time');
    await selectTimePickerByLabel('Time Picker', '10', '20', '59', page);
    await expect(page.getByText('Current time: 10:20:59')).toBeVisible();
});

async function selectTimePickerByLabel(label: string, hours: string, minutes: string, seconds: string, page: Page) {
    let inputXpath = `(//div[.//span[normalize-space(text())="${label}"] and @role="separator"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-input ')])[1]//input`;
    await page.locator(inputXpath).click();
    let hoursXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel ')]//ul[@data-type="hour"]//li[normalize-space(.)="${hours}"]`;
    await page.locator(hoursXpath).click();
    let minutesXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel ')]//ul[@data-type="minute"]//li[normalize-space(.)="${minutes}"]`;
    await page.locator(minutesXpath).click();
    let secondsXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel ')]//ul[@data-type="second"]//li[normalize-space(.)="${seconds}"]`;
    await page.locator(secondsXpath).click();
    let okButtonXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-footer ')]//button[normalize-space()="OK"]`;
    await page.locator(okButtonXpath).click();
}

test(`Verify timepicker at now`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/date-time');
    let inputXpath = `(//div[.//span[normalize-space(text())="Time Picker"] and @role="separator"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-input ')])[1]//input`;
    await page.locator(inputXpath).click();
    let timeBeforeClick = new Date().getTime();
    let nowButtonXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-footer ')]//a[normalize-space()="Now"]`;
    await page.waitForTimeout(1000);
    await page.locator(nowButtonXpath).click();
    await page.waitForTimeout(1000);
    let timeAfterClick = new Date().getTime();
    let actualTime = await page.locator(inputXpath).getAttribute('value');
    let currentDate = new Date().toISOString().split('T')[0];
    let actualDateTime = new Date(`${currentDate} ${actualTime}`).getTime();
    expect(actualDateTime).toBeGreaterThanOrEqual(timeBeforeClick);
    expect(actualDateTime).toBeLessThanOrEqual(timeAfterClick);
});

test(`Verify datepicker`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/date-time');
    await selectDateByLabel('Date Picker', 1990, 'May', '1', page);
    expect(page.getByText('Current date: 1990-05-01')).toBeVisible();
    await selectDateByLabel('Date Picker', 2020, 'Feb', '19', page);
    expect(page.getByText('Current date: 2020-02-19')).toBeVisible();
    await selectDateByLabel('Date Picker', 2030, 'Dec', '30', page);
    expect(page.getByText('Current date: 2030-12-30')).toBeVisible();
});

async function selectDateByLabel(label: string, year: number, month: string, day: string, page: Page) {
    let inputXpath = `(//div[.//span[normalize-space(text())="${label}"] and @role="separator"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-input ')])[1]//input`;
    await page.locator(inputXpath).click();
    let yearHeaderXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-header-view ')]//button[@aria-label="year panel"]`;
    await page.locator(yearHeaderXpath).click();
    let yearRangeXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-header-view ')]//button`;
    let yearRangeText = await page.locator(yearRangeXpath).textContent();
    let minYear = Number.parseInt(yearRangeText?.trim().split('-')[0] ?? '');
    let maxYear = Number.parseInt(yearRangeText?.trim().split('-')[1] ?? '');
    let yearXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-body ')]//td[.//div[normalize-space(text())="${year}"]]`;
    let clickCount;
    if (year < minYear) {
        clickCount = Math.floor((minYear - year) / (maxYear - minYear + 1));
        let backButtonXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-header ')]//button[@aria-label="super-prev-year"]`;
        for (let i = 0; i < clickCount; i++) {
            await page.locator(backButtonXpath).click();
        }
    } else if (year > maxYear) {
        clickCount = Math.floor((year - maxYear) / (maxYear - minYear + 1));
        let nextButtonXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-header ')]//button[@aria-label="super-next-year"]`;
        for (let i = 0; i < clickCount; i++) {
            await page.locator(nextButtonXpath).click();
        }
    }
    await page.locator(yearXpath).click();
    let monthXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-body ')]//td[.//div[normalize-space(text())="${month}"]]`;
    await page.locator(monthXpath).click();
    let dateXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-body ')]//td[.//div[normalize-space(text())="${day}"] and contains(concat(' ',normalize-space(@class),' '),' ant-picker-cell-in-view ')]`;
    await page.locator(dateXpath).click();
}