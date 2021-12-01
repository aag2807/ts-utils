type Action<T> = {
	type: T;
	payload?: any;
}

type reducer<T extends unknown> = (arg1: any, arg2: Action<T>) => any

const createStore = (reducer: reducer<any>, preloadedState: any) => {
	let currentReducer = reducer;
	let currentState = preloadedState;
	let currentListeners: any[] = [];
	let nextlisteners = currentListeners;

	const getState = () => currentState;

	const dispatch = (action: Action<any>) => {
		currentState = currentReducer(currentState, action);
		const listeners = (currentState = nextlisteners);
		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i];
			listener();
		}
		return action;
	}

	const subscribe = (listener: any) => {
		listener();
		nextlisteners.push(listener);
	}

	return {
		getState,
		dispatch,
		subscribe
	}
}

type SampleState = {
	todos: any[];
}

type ExampleActionTypes = "PUSH" | "REMOVE";


const exampleInitialState: SampleState = {
	todos: []
}

const sampleReducer = (
	state: typeof exampleInitialState,
	action: Action<ExampleActionTypes>,
): typeof exampleInitialState => {

	switch (action.type) {
		case 'PUSH':
			state.todos.push(action.payload.newItem);
			return state;
		case 'REMOVE':
			let map = [...state.todos].filter((todo: any) => todo.id == action.payload.id);
			state.todos = map;
			return state;
		default:
			return state;
	}
}

let sampleStore = createStore(sampleReducer, exampleInitialState);

//USE EXAMPLE

sampleStore.dispatch({
	type: 'PUSH',
	payload: {
		newItem: { title: 'NAME', id: 0 }
	}
})

sampleStore.getState() // [{ title: 'Name', id: 0}]

sampleStore.dispatch({
	type: 'REMOVE',
	payload: {
		id: 0
	}
})

sampleStore.getState() // []

/**
 * <h1>
 * 	my todos
 * </h1>
 * 
 * {todos && todos.map(todo => {
 * 	return (
 * 		<li>{todo}</li>
 * 	)
 * })}
 * 
 */

sampleStore.subscribe(()=>{
	/**
	 *  let todo = sampleStore.getState().tooos;
	 *  setState(todo)
	 */
})