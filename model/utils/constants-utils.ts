import { getEnv } from "./config-utils";

export const UI_HOST = getEnv('UI_HOST');
export const UI_PORT = getEnv('UI_PORT');
export const UI_BASE_URL = `${UI_HOST}${UI_PORT ? ':' + UI_PORT : ''}`;
export const UI_ADMIN_LOGIN_URL = `${UI_BASE_URL}/admin/login`;
export const ADMIN_USERNAME = getEnv('ADMIN_USERNAME');
export const ADMIN_PASSWORD = getEnv('ADMIN_PASSWORD');