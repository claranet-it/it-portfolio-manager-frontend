import { Company } from '@models/company';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { Route } from 'src/router';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_ROLE_KEY = 'auth_role';
export const AUTH_CREW_KEY = 'auth_crew';
export const AUTH_USER_KEY = 'auth_user';

export const CHATBOT_COOKIE_KEY = 'token';

export const SKILL_LEVEL_SCORE_LIMIT = 2;
export const COVERAGE_BAD_LIMIT = 30;
export const COVERAGE_GOOD_LIMIT = 75;

export const GRAVATAR_URL = 'https://gravatar.com/';
export const GRAVATAR_ACCOUNT_URL = 'https://support.gravatar.com/basic/account-signup/';

export const SEARCH_TEXT_AREA_ROWS = 3;
export const KEYBOARD_ENTER = 'Enter';

export const SELF_TOAST_CLOSING_TIME = 5000; // 5sec

export const INIT_PROJECT_VALUE = { name: '', type: '', plannedHours: 0 } as Project;
export const INIT_TASK_VALUE = {
	name: '',
	plannedHours: 0,
	completed: false,
} as Task;

export const INIT_COMPANY_VALUE = {
	id: '',
	domain: '',
	name: '',
	image_url: '',
	skills: [],
} as Company;

export const REPORT_LIST_RESULTS_PER_PAGE = 10;

export const CSV_REPORT_PROJECTS_FILE_NAME = 'Brickly_projects_report';
export const CSV_REPORT_GROUPBY_FILE_NAME = 'Brickly_groupby_report';

export const WORK_START_HOUR = '09:00';
export const WORK_END_HOUR = '18:00';

export enum Roles {
	SUPERADMIN = 'SUPERADMIN',
	ADMIN = 'ADMIN',
	TEAM_LEADER = 'TEAM_LEADER',
	USER = 'USER',
}

export const ITALY_COMPANY_ID = 'it'; // TODO: temporary, change when final company id is defined

export const PUBLIC_ROUTES: Route[] = ['auth', 'public-profile'] as const;
