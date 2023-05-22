import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import GenericActionDictionary from '../src/ActionDictionary';
import { TTestAction, TTestPayload } from './fixtures';
import { TValidator } from '../src/types';
import { pickFromArray, sampleArray, sampleRange } from '../src/utils/fixtures';

class ActionDictionaryTest extends GenericActionDictionary<
	TTestAction,
	TTestPayload<TTestAction>
> {
	constructor() {
		super();
	}

	getDefaultActionValidator() {
		return this.defaultActionValidator;
	}
}

let sampleInstance: ActionDictionaryTest;

const testNamespace = 'test';
const testNamespaceCross = 'cross';
const testNamespaceExtra = 'extra';

const sampleKeys = {
	default: ['a', 'b', 'c'],
	[testNamespace]: ['d', 'e'],
	[testNamespaceCross]: ['a', 'd', 'x', 'y'],
};

const sampleAction = () =>
	pickFromArray(Object.values(sampleKeys).flatMap((x) => x))[0];

describe('ActionDictionary', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllTimers();
		sampleInstance = new ActionDictionaryTest();
	});
	describe('constructor', () => {
		test('returns an instance of GenericActionDictionary', () => {
			expect(sampleInstance).toBeInstanceOf(GenericActionDictionary);
		});
		test('is empty by default', () => {
			expect(sampleInstance.getDictionary()).toEqual({});
		});
	});

	describe('/setActionValidator', () => {
		const testValidator = ((a: number) =>
			a % 15 === 0) as TValidator<TTestAction>;
		test('accepts a function to overwrite default Action Validator', () => {
			sampleInstance.setActionValidator(testValidator);
			expect(sampleInstance.validateAction).toBe(testValidator);
		});
		test('resets the Action Validator to default when called with null', () => {
			sampleInstance.setActionValidator(testValidator);
			sampleInstance.setActionValidator(null);
			expect(sampleInstance.validateAction).toBe(
				sampleInstance.getDefaultActionValidator()
			);
		});
		test('returns self', () => {
			expect(sampleInstance.setActionValidator(testValidator)).toBe(
				sampleInstance
			);
		});
	});

	describe('/getDictionary', () => {
		beforeEach(() => {
			sampleInstance.addActions({ keys: sampleKeys.default });
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns the dictionary', () => {
			const dictionary = sampleInstance.getDictionary();
			expect(dictionary).toBeDefined();
			expect(Object.keys(dictionary)).toHaveLength(
				Object.values(sampleKeys).flatMap((x) => x).length
			);
		});
		test('filters by namespace', () => {
			const dictionary = sampleInstance.getDictionary(testNamespace);
			const values = Object.values(dictionary);
			expect(Object.keys(dictionary)).toHaveLength(
				sampleKeys[testNamespace].length
			);
			expect(values).toEqual(
				sampleInstance.getActionValues({
					namespace: testNamespace,
					keys: sampleKeys[testNamespace],
				})
			);
		});
		test('ignores invalid namespaces', () => {
			expect(sampleInstance.getDictionary(testNamespaceExtra)).toEqual(
				{}
			);
			// @ts-ignore
			expect(sampleInstance.getDictionary(123.45)).toEqual({});
		});
	});

	describe('/getActionValues', () => {
		beforeEach(() => {
			sampleInstance.addActions({ keys: sampleKeys.default });
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns empty array for empty input', () => {
			expect(sampleInstance.getActionValues({ keys: [] })).toEqual([]);
		});
		test('returns a valid Action value without namespace', () => {
			const values = sampleInstance.getActionValues({
				keys: pickFromArray(sampleKeys.default),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateAction(values[0])).toBe(true);
		});
		test('returns a valid Action with namespace', () => {
			const values = sampleInstance.getActionValues({
				namespace: testNamespace,
				keys: pickFromArray(sampleKeys[testNamespace]),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateAction(values[0])).toBe(true);
		});
		describe('returns null when namespace and/or action does not match', () => {
			test('action from different namespace', () => {
				const values = sampleInstance.getActionValues({
					namespace: testNamespace,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			test('action from non-existent namespace', () => {
				const values = sampleInstance.getActionValues({
					namespace: testNamespaceExtra,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			test('action in default namespace that does not exist', () => {
				const values = sampleInstance.getActionValues({
					keys: pickFromArray(sampleKeys[testNamespace]),
				});
				expect(values).toEqual([null]);
			});
			test('returns as many nulls as keys were requested', () => {
				const sampleLength = sampleRange(1, 5);
				expect(
					sampleInstance.getActionValues({
						namespace: testNamespaceExtra,
						keys: sampleArray(() => sampleAction(), sampleLength),
					})
				).toEqual(new Array(sampleLength).fill(null));
			});
		});
	});
});
