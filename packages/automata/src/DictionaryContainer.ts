/**
 * @module AbstractDictionaryContainer
 * @description A common parent for all Dictionaries which implements numeric hash for any incoming values, possibly
 * split by namespaces
 */

export default abstract class AbstractDictionaryContainer<ItemType> {
	protected _dictionary: Record<string, ItemType> = {};
	protected _dictionaryIndex = new Map<
		ItemType,
		{ key: string; namespace?: string }
	>();
	protected _namespaceIndex: Record<string, string[]> = {};

	public getDictionary(namespace?: string) {
		if (namespace == null) return this._dictionary;
		return (this._namespaceIndex[namespace] ?? []).reduce(
			(dict, itemKey) =>
				Object.assign(dict, {
					[itemKey]: this._dictionary[itemKey],
				}),
			{} as Record<string, ItemType>
		);
	}

	protected _stringHash(str: string) {
		let hash = 0;
		if (!str?.length) return hash;
		for (let i = 0; i < str.length; i++) {
			const chr = str.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0;
		}
		return Math.abs(hash);
	}

	protected _findItem(itemKey: string, namespace?: string) {
		const k = this._getItemKey(itemKey, namespace);
		const v = this._dictionary[k];
		if (this._dictionaryIndex.has(v)) return v;
		delete this._dictionary[k];
		if (!namespace) return null;
		if (this._namespaceIndex[namespace])
			this._namespaceIndex[namespace] = this._namespaceIndex[
				namespace
			].filter((v) => v !== k);
		return null;
	}

	protected _getItemKey(itemKey: string, namespace = '') {
		if (!itemKey?.length) throw new Error(`item key is empty`);
		return `${namespace ?? ''}/${itemKey}`;
	}

	protected _getItemValue(itemKey: string, namespace?: string) {
		if (!itemKey?.length) throw new Error(`item key is empty`);
		let value = this._stringHash(this._getItemKey(itemKey, namespace));
		if (Object.values(this._dictionary).includes(value as ItemType))
			value = value + this._stringHash(JSON.stringify(this._dictionary));
		return value as ItemType;
	}

	protected _deleteItemKey(itemKey: string) {
		const item = this?._dictionary[itemKey];
		if (!item) return this;
		const meta = this._dictionaryIndex.get(item);
		delete this._dictionary[itemKey];
		if (meta?.namespace)
			this._namespaceIndex[meta.namespace] = this._namespaceIndex[
				meta.namespace
			].filter((v) => v !== itemKey);
		this._dictionaryIndex.delete(item);
		return this;
	}

	protected _getValueData(value: ItemType) {
		return this._dictionaryIndex.get(value) ?? null;
	}

	protected _addItemKey(itemKey: string, namespace?: string) {
		const k = this._getItemKey(itemKey, namespace);
		if (this._dictionary[k])
			throw new Error(
				`Item key ${itemKey} is taken within ${
					namespace == null
						? 'default namespace'
						: `namespace "${namespace}"`
				}`
			);
		const value = this._getItemValue(itemKey, namespace);
		this._dictionary[k] = value;
		if (namespace) {
			if (!this._namespaceIndex[namespace])
				this._namespaceIndex[namespace] = [];
			this._namespaceIndex[namespace].push(k);
		}
		this._dictionaryIndex.set(value, { key: k, namespace });
		return value;
	}

	protected _clearItems(namespace: string | undefined) {
		if (namespace != null) {
			for (const itemKey of this._namespaceIndex[namespace] ?? []) {
				this._deleteItemKey(itemKey);
			}
			delete this._namespaceIndex[namespace];
		} else {
			this._namespaceIndex = {};
			this._dictionaryIndex.clear();
			this._dictionary = {};
		}
		return this;
	}
}
