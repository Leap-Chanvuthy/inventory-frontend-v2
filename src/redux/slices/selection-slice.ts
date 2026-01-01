import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectionMode = "single" | "multiple";

/**
 * Reusable selection item.
 * - `id` is the stable identifier
 * - `payload` can be any shape (User, Product, etc.)
 */
export type SelectionItem<TPayload = unknown> = {
	id: string;
	payload: TPayload;
};

export type SelectionScopeKey = string;

export type ScopedSelectionState<TPayload = unknown> = {
	mode: SelectionMode;
	/** Ordered selection IDs */
	ids: string[];
	/** Payload cache by id */
	entities: Record<string, TPayload>;
};

export type SelectionState = {
	/**
	 * Multiple independent selections (users table, products table, etc.)
	 * Key can be any string: e.g. "users", "products", "warehouse-items".
	 */
	scopes: Record<SelectionScopeKey, ScopedSelectionState<unknown>>;
};

const DEFAULT_SCOPE_STATE: ScopedSelectionState<unknown> = {
	mode: "multiple",
	ids: [],
	entities: {},
};

const initialState: SelectionState = {
	scopes: {},
};

function ensureScope(state: SelectionState, scope: SelectionScopeKey) {
	if (!state.scopes[scope]) {
		state.scopes[scope] = { ...DEFAULT_SCOPE_STATE };
	}
}

function uniquePush(ids: string[], id: string) {
	if (!ids.includes(id)) ids.push(id);
}

export const selectionSlice = createSlice({
	name: "selection",
	initialState,
	reducers: {
		/** Create or reset a scope */
		initScope(
			state,
			action: PayloadAction<{ scope: SelectionScopeKey; mode?: SelectionMode }>
		) {
			const { scope, mode } = action.payload;
			state.scopes[scope] = {
				mode: mode ?? "multiple",
				ids: [],
				entities: {},
			};
		},

		/** Change selection mode; if switching to single, keeps only the first id. */
		setMode(
			state,
			action: PayloadAction<{ scope: SelectionScopeKey; mode: SelectionMode }>
		) {
			const { scope, mode } = action.payload;
			ensureScope(state, scope);

			const current = state.scopes[scope];
			current.mode = mode;

			if (mode === "single" && current.ids.length > 1) {
				const keepId = current.ids[0];
				current.ids = [keepId];
				current.entities = keepId in current.entities ? { [keepId]: current.entities[keepId] } : {};
			}
		},

		/** Clear ids + payloads for a scope */
		clearScope(state, action: PayloadAction<{ scope: SelectionScopeKey }>) {
			const { scope } = action.payload;
			ensureScope(state, scope);
			state.scopes[scope].ids = [];
			state.scopes[scope].entities = {};
		},

		/** Remove entire scope */
		removeScope(state, action: PayloadAction<{ scope: SelectionScopeKey }>) {
			delete state.scopes[action.payload.scope];
		},

		/** Clear all scopes */
		clearAll(state) {
			state.scopes = {};
		},

		/**
		 * Select exactly one item (sets mode behavior aside and forces single selection for the scope).
		 * Useful for detail pages.
		 */
		selectSingle(state, action: PayloadAction<{ scope: SelectionScopeKey; item: SelectionItem }>) {
			const { scope, item } = action.payload;
			ensureScope(state, scope);

			const current = state.scopes[scope];
			current.mode = "single";
			current.ids = [item.id];
			current.entities = { [item.id]: item.payload };
		},

		/**
		 * Toggle item selection.
		 * - multiple mode: adds/removes
		 * - single mode: replaces (or clears if same id)
		 */
		toggle(
			state,
			action: PayloadAction<{ scope: SelectionScopeKey; item: SelectionItem }>
		) {
			const { scope, item } = action.payload;
			ensureScope(state, scope);

			const current = state.scopes[scope];

			if (current.mode === "single") {
				const isSame = current.ids.length === 1 && current.ids[0] === item.id;
				if (isSame) {
					current.ids = [];
					current.entities = {};
					return;
				}

				current.ids = [item.id];
				current.entities = { [item.id]: item.payload };
				return;
			}

			const existingIndex = current.ids.indexOf(item.id);
			if (existingIndex >= 0) {
				current.ids.splice(existingIndex, 1);
				delete current.entities[item.id];
				return;
			}

			uniquePush(current.ids, item.id);
			current.entities[item.id] = item.payload;
		},

		/** Add many items (multiple mode). Keeps existing selections unless overwritten by same id. */
		addMany(
			state,
			action: PayloadAction<{ scope: SelectionScopeKey; items: SelectionItem[] }>
		) {
			const { scope, items } = action.payload;
			ensureScope(state, scope);

			const current = state.scopes[scope];
			if (current.mode === "single") {
				const first = items[0];
				if (!first) return;
				current.ids = [first.id];
				current.entities = { [first.id]: first.payload };
				return;
			}

			for (const item of items) {
				uniquePush(current.ids, item.id);
				current.entities[item.id] = item.payload;
			}
		},

		/** Replace selection with provided items (respects current mode). */
		setSelection(
			state,
			action: PayloadAction<{ scope: SelectionScopeKey; items: SelectionItem[] }>
		) {
			const { scope, items } = action.payload;
			ensureScope(state, scope);
			const current = state.scopes[scope];

			if (current.mode === "single") {
				const first = items[0];
				if (!first) {
					current.ids = [];
					current.entities = {};
					return;
				}
				current.ids = [first.id];
				current.entities = { [first.id]: first.payload };
				return;
			}

			current.ids = [];
			current.entities = {};
			for (const item of items) {
				uniquePush(current.ids, item.id);
				current.entities[item.id] = item.payload;
			}
		},

		/** Remove one id from selection */
		removeOne(state, action: PayloadAction<{ scope: SelectionScopeKey; id: string }>) {
			const { scope, id } = action.payload;
			ensureScope(state, scope);

			const current = state.scopes[scope];
			const index = current.ids.indexOf(id);
			if (index >= 0) current.ids.splice(index, 1);
			delete current.entities[id];
		},
	},
});

export const {
	initScope,
	setMode,
	clearScope,
	removeScope,
	clearAll,
	selectSingle,
	toggle,
	addMany,
	setSelection,
	removeOne,
} = selectionSlice.actions;

export default selectionSlice.reducer;

/**
 * Lightweight selectors (work with unknown payloads).
 * You can cast payload type at call site: `as User` if needed.
 */
export const selectScope = (state: { selection: SelectionState }, scope: SelectionScopeKey) =>
	state.selection.scopes[scope] ?? DEFAULT_SCOPE_STATE;

export const selectSelectedIds = (state: { selection: SelectionState }, scope: SelectionScopeKey) =>
	selectScope(state, scope).ids;

export const selectSelectedEntities = (state: { selection: SelectionState }, scope: SelectionScopeKey) =>
	selectScope(state, scope).entities;

export const selectSelectedItems = (state: { selection: SelectionState }, scope: SelectionScopeKey) => {
	const scoped = selectScope(state, scope);
	return scoped.ids
		.map((id) => ({ id, payload: scoped.entities[id] }))
		.filter((x) => x.payload !== undefined);
};

export const selectSingleSelectedId = (state: { selection: SelectionState }, scope: SelectionScopeKey) => {
	const ids = selectScope(state, scope).ids;
	return ids[0] ?? null;
};
