import {
	TAutomataActionPayload,
	TAutomataBaseActionType,
	TValidator,
} from './types';
import {
	TActionDictionaryMapping,
	TActionKeysCollection,
	TActionLookupParams,
	TActionValuesCollection,
} from './types/dictionaries';
import { IActionDictionary } from './types/interfaces';
import Utils from './utils';

export default abstract class GenericActionDictionary<
	ActionType extends TAutomataBaseActionType,
	PayloadType extends { [K in ActionType]: any }
> implements IActionDictionary<ActionType, PayloadType>
{
	protected _actionDictionary: TActionDictionaryMapping<ActionType> = {};
	protected _actionLookupindex = new Map<
		ActionType,
		{ key: string; namespace?: string }
	>();
	protected _actionNamespaceIndex: Record<string, string[]> = {};
	protected _actionValidator?: TValidator<ActionType>;
	protected _payloadValidator?: TValidator<
		TAutomataActionPayload<ActionType, PayloadType>
	>;
	protected defaultActionValidator =
		Utils.isPositiveInteger as TValidator<ActionType>;
	protected defaultPayloadValidator = ((actionPayload) =>
		this.validateAction(actionPayload?.action) &&
		typeof actionPayload?.payload === 'object') as TValidator<
		TAutomataActionPayload<ActionType, PayloadType>
	>;

	public get validateAction() {
		return this._actionValidator ?? this.defaultActionValidator;
	}

	public get validateActionPayload() {
		return this._payloadValidator ?? this.defaultPayloadValidator;
	}

	public setActionValidator(
		actionValidator: TValidator<ActionType> | null = null
	) {
		if (actionValidator === null) {
			this._actionValidator = undefined;
			return this;
		}
		if (typeof actionValidator !== 'function')
			throw new Error(`passed Action Validator is not a function`);
		this._actionValidator = actionValidator;
		return this;
	}

	public setActionPayloadValidator(
		actionPayloadValidator: TValidator<
			TAutomataActionPayload<ActionType, PayloadType>
		> | null = null
	) {
		if (actionPayloadValidator === null) {
			this._payloadValidator = undefined;
			return this;
		}
		if (typeof actionPayloadValidator !== 'function')
			throw new Error(
				`passed Action Payload Validator is not a function`
			);
		this._payloadValidator = actionPayloadValidator;
		return this;
	}

	public getActionKeys({
		actions = [],
		namespace,
	}: TActionValuesCollection<ActionType>): Array<string | null> {
		const r: Array<string | null> = [];
		for (const action of actions) {
			const actionKey = this._actionLookupindex.get(action);
			if (
				actionKey?.key &&
				this._actionDictionary[actionKey.key] === action &&
				(null == namespace ||
					(this._actionNamespaceIndex[namespace].includes(
						actionKey?.key
					) &&
						actionKey?.namespace === namespace))
			) {
				r.push(actionKey?.key);
			} else r.push(null);
		}
		return r;
	}

	public clearActions(namespace: string | undefined) {
		const actionList =
			namespace == null
				? Object.keys(this._actionDictionary)
				: this._actionNamespaceIndex[namespace];
		for (const actionKey of actionList) {
			this._deleteActionKey(actionKey);
		}
		if (namespace != null) {
			delete this._actionNamespaceIndex[namespace];
		}
		return this;
	}

	public removeActions({
		namespace,
		actions = [],
		keys = [],
	}: TActionLookupParams<ActionType>) {
		const actionsToDelete = [
			...actions.filter(this.validateAction),
			...keys.map(
				(actionKey) =>
					this._actionDictionary[
						this._getActionKey(actionKey, namespace)
					]
			),
		];
		const actionKeys = actionsToDelete
			.map((action) => this._actionLookupindex.get(action))
			.filter(
				namespace == null
					? Boolean
					: (action) =>
							!!action &&
							this._actionNamespaceIndex[namespace].includes(
								action.key
							) &&
							namespace === action.namespace
			);
		for (const actionKey of actionKeys)
			if (actionKey) this._deleteActionKey(actionKey.key);
		return this;
	}

	public getDictionary(
		namespace: string | null = null
	): TActionDictionaryMapping<ActionType> {
		return (
			namespace
				? this._actionNamespaceIndex[namespace]
				: Object.keys(this._actionDictionary)
		).reduce(
			(dict, actionKey) =>
				Object.assign(dict, {
					[actionKey]: this._actionDictionary[actionKey],
				}),
			{} as TActionDictionaryMapping<ActionType>
		);
	}

	public getActionValues({
		namespace,
		keys = [],
	}: TActionKeysCollection<ActionType>): Array<ActionType | null> {
		return (keys ?? []).map(
			(actionKey) =>
				this._actionDictionary[
					this._getActionKey(actionKey, namespace)
				] ?? null
		);
	}

	public addActions({
		namespace,
		keys,
	}: TActionKeysCollection<ActionType>): ActionType[] {
		return (keys || []).map((k) => this._addActionKey(k, namespace));
	}

	protected _stringHash(str: string): number {
		let hash = 0;
		if (!str?.length) return hash;
		for (let i = 0; i < str.length; i++) {
			const chr = str.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0;
		}
		return hash;
	}

	protected _getActionKey(actionKey: string, namespace = ''): string {
		if (!actionKey?.length) throw new Error(`action key is empty`);
		return `${namespace ?? ''}/${actionKey}`;
	}

	protected _getActionValue(
		actionKey: string,
		namespace?: string
	): ActionType {
		if (!actionKey?.length) throw new Error(`action key is empty`);
		let value = this._stringHash(this._getActionKey(actionKey, namespace));
		if (Object.values(this._actionDictionary).includes(value as ActionType))
			value =
				value +
				this._stringHash(JSON.stringify(this._actionDictionary));
		return value as ActionType;
	}

	protected _deleteActionKey(actionKey: string) {
		const action = this?._actionDictionary[actionKey];
		if (!action) return this;
		const meta = this._actionLookupindex.get(action);
		delete this._actionDictionary[actionKey];
		if (meta?.namespace)
			this._actionNamespaceIndex[meta.namespace] =
				this._actionNamespaceIndex[meta.namespace].filter(
					(v) => v === actionKey
				);
		this._actionLookupindex.delete(action);
		return this;
	}

	protected _addActionKey(actionKey: string, namespace?: string): ActionType {
		const k = this._getActionKey(actionKey, namespace);
		if (this._actionDictionary[k])
			throw new Error(
				`action key ${actionKey} is taken within namespace "${namespace}"`
			);
		const value = this._getActionValue(actionKey, namespace);
		this._actionDictionary[k] = value;
		if (namespace) {
			if (!this._actionNamespaceIndex[namespace])
				this._actionNamespaceIndex[namespace] = [];
			this._actionNamespaceIndex[namespace].push(k);
		}
		this._actionLookupindex.set(value, { key: k, namespace });
		return value;
	}
}
