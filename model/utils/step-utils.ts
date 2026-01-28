import * as allure from "allure-js-commons";

export async function iStep(name: string, action: () => Promise<any>): Promise<any> {
    await allure.step(name, async () => {
        await action();
    })
}