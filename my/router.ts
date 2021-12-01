/**
 * USAGE 
 * 
		import createRouter from "./router.js";
		import createPages from "./pages.js";

		const container = document.querySelector("#app");

		const pages = createPages(container);

		const router = createRouter();

		router
				.addRoute("/", pages.home)
				.addRoute("/list", pages.list)
				.addRoute("/list/:id", pages.detail)
				.addRoute("/list/:id/:anotherId", pages.anotherDetail)
				.setNotFound(pages.notFound)
				.start();
*/

//PAGES

const createPages = (container: HTMLElement) => {

	const notFound = () => {
		container.textContent = 'NOT FOUND 404!'
	}

	const home = () => {
		container.textContent = "HOME PAGE"
	}

	const detail = (params: any) => {
		const { id } = params
		container.textContent = `detail page with id ${id}`
	}

	return {
		notFound,
		home,
		detail
	}
}

type CB = () => (arg1?: any, arg2?: any) => any;

type ROUTE = {
	params?: any[],
	testRegExp: RegExp;
	callback: CB
}

interface Router  {
	start?: () => Router;
	navigate?: any;
	setNotFound?:(callback: CB) => Router
	addRoute?: (path:string, callback: CB) => Router;
} 
//ROUTER

const ROUTE_PARAMETER_REGEXP = /:(\w+)/g;
const URL_FRAGMENT_REGEXP = "([^\\/]+)";
const TICKTIME = 250;
const NAV_A_SELECTER = "a[data-navigation]";

const extractUrlParams = (route: ROUTE, pathName: string): any => {
	if (route.params?.length === 0) return {};

	const params: any = {};
	const matches = pathName.match(route.testRegExp);

	matches?.shift();

	matches?.forEach((paramVal: string, index: number) => {
		const paramName: any = (route.params as any[])[index];
		params[paramName] = paramVal;
	})

	return params;
}


const Router = () => {
	const routes: ROUTE[] = [];
	let notFound = () => { };
	let lastPathName: string;

	const router: Router = {}

	const checkRoutes = () => {
		const { pathname } = window.location;
		if (lastPathName === pathname) return;

		lastPathName = pathname

		const currentRoute: any = routes.find((route: ROUTE) => route.testRegExp.test(pathname))

		if (!currentRoute) {
			notFound();
			return;
		}
		const urlparams = extractUrlParams(currentRoute, pathname);
		currentRoute.callback(urlparams);
	}

	router.addRoute = (path: string, callback: CB) => {
		const params: any[] = []

		const parsedPath = path
			.replace(ROUTE_PARAMETER_REGEXP, (match: any, paramName: any) => {
				params.push(paramName);
				return URL_FRAGMENT_REGEXP;
			})
			.replace(/\//g, "\\/");

		routes.push({
			testRegExp: new RegExp(`^${parsedPath}`),
			callback,
			params
		})

		return router;
	}

	router.setNotFound = (cb: CB) => {
		notFound = cb
		return router;
	}

	router.navigate = (path: string) => {
		window.history.pushState(null, (null as any), path)
	}

	router.start = () => {
		checkRoutes();
		window.setInterval(checkRoutes, TICKTIME);

		document.body.addEventListener('click', (e) => {
			const { target } = e!;

			if ((target as any).matches(NAV_A_SELECTER)) {
				e.preventDefault();
				let href = (target as HTMLAnchorElement).href
				router.navigate((href));
			}

		})

		return router;
	}
	return router;
}