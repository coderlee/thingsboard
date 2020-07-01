///
/// Copyright © 2016-2020 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { AliasFilterType, EntityFilters } from '@shared/models/alias.models';
import { EntityId } from '@shared/models/id/entity-id';
import { SortDirection } from '@angular/material/sort';
import { DataKeyType } from '@shared/models/telemetry/telemetry.models';
import { EntityInfo } from '@shared/models/entity.models';
import { EntityType } from '@shared/models/entity-type.models';
import { Datasource, DatasourceType } from '@shared/models/widget.models';
import { PageData } from '@shared/models/page/page-data';
import { isEqual } from '@core/utils';

export enum EntityKeyType {
  ATTRIBUTE = 'ATTRIBUTE',
  CLIENT_ATTRIBUTE = 'CLIENT_ATTRIBUTE',
  SHARED_ATTRIBUTE = 'SHARED_ATTRIBUTE',
  SERVER_ATTRIBUTE = 'SERVER_ATTRIBUTE',
  TIME_SERIES = 'TIME_SERIES',
  ENTITY_FIELD = 'ENTITY_FIELD'
}

export const entityKeyTypeTranslationMap = new Map<EntityKeyType, string>(
  [
    [EntityKeyType.ATTRIBUTE, 'filter.key-type.attribute'],
    [EntityKeyType.TIME_SERIES, 'filter.key-type.timeseries'],
    [EntityKeyType.ENTITY_FIELD, 'filter.key-type.entity-field']
  ]
);

export function entityKeyTypeToDataKeyType(entityKeyType: EntityKeyType): DataKeyType {
  switch (entityKeyType) {
    case EntityKeyType.ATTRIBUTE:
    case EntityKeyType.CLIENT_ATTRIBUTE:
    case EntityKeyType.SHARED_ATTRIBUTE:
    case EntityKeyType.SERVER_ATTRIBUTE:
      return DataKeyType.attribute
    case EntityKeyType.TIME_SERIES:
      return DataKeyType.timeseries;
    case EntityKeyType.ENTITY_FIELD:
      return DataKeyType.entityField;
  }
}

export interface EntityKey {
  type: EntityKeyType;
  key: string;
}

export enum EntityKeyValueType {
  STRING = 'STRING',
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN'
}

export interface EntityKeyValueTypeData {
  name: string;
  icon: string;
}

export const entityKeyValueTypesMap = new Map<EntityKeyValueType, EntityKeyValueTypeData>(
  [
    [
      EntityKeyValueType.STRING,
      {
        name: 'filter.value-type.string',
        icon: 'mdi:format-text'
      }
    ],
    [
      EntityKeyValueType.NUMERIC,
      {
        name: 'filter.value-type.numeric',
        icon: 'mdi:numeric'
      }
    ],
    [
      EntityKeyValueType.BOOLEAN,
      {
        name: 'filter.value-type.boolean',
        icon: 'mdi:checkbox-marked-outline'
      }
    ]
  ]
);

export function entityKeyValueTypeToFilterPredicateType(valueType: EntityKeyValueType): FilterPredicateType {
  switch (valueType) {
    case EntityKeyValueType.STRING:
      return FilterPredicateType.STRING;
    case EntityKeyValueType.NUMERIC:
      return FilterPredicateType.NUMERIC;
    case EntityKeyValueType.BOOLEAN:
      return FilterPredicateType.BOOLEAN;
  }
}

export function createDefaultFilterPredicate(valueType: EntityKeyValueType, complex: boolean): KeyFilterPredicate {
  const predicate = {
    type: complex ? FilterPredicateType.COMPLEX : entityKeyValueTypeToFilterPredicateType(valueType)
  } as KeyFilterPredicate;
  switch (predicate.type) {
    case FilterPredicateType.STRING:
      predicate.operation = StringOperation.STARTS_WITH;
      predicate.value = '';
      predicate.ignoreCase = false;
      break;
    case FilterPredicateType.NUMERIC:
      predicate.operation = NumericOperation.EQUAL;
      predicate.value = 0;
      break;
    case FilterPredicateType.BOOLEAN:
      predicate.operation = BooleanOperation.EQUAL;
      predicate.value = false;
      break;
    case FilterPredicateType.COMPLEX:
      predicate.operation = ComplexOperation.AND;
      predicate.predicates = [];
      break;
  }
  return predicate;
}

export enum FilterPredicateType {
  STRING = 'STRING',
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN',
  COMPLEX = 'COMPLEX'
}

export enum StringOperation {
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  CONTAINS = 'CONTAINS',
  NOT_CONTAIN = 'NOT_CONTAIN'
}

export const stringOperationTranslationMap = new Map<StringOperation, string>(
  [
    [StringOperation.EQUAL, 'filter.operation.equal'],
    [StringOperation.NOT_EQUAL, 'filter.operation.not-equal'],
    [StringOperation.STARTS_WITH, 'filter.operation.starts-with'],
    [StringOperation.ENDS_WITH, 'filter.operation.ends-with'],
    [StringOperation.CONTAINS, 'filter.operation.contains'],
    [StringOperation.NOT_CONTAIN, 'filter.operation.not-contain']
  ]
);

export enum NumericOperation {
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER = 'GREATER',
  LESS = 'LESS',
  GREATER_OR_EQUAL = 'GREATER_OR_EQUAL',
  LESS_OR_EQUAL = 'LESS_OR_EQUAL'
}

export const numericOperationTranslationMap = new Map<NumericOperation, string>(
  [
    [NumericOperation.EQUAL, 'filter.operation.equal'],
    [NumericOperation.NOT_EQUAL, 'filter.operation.not-equal'],
    [NumericOperation.GREATER, 'filter.operation.greater'],
    [NumericOperation.LESS, 'filter.operation.less'],
    [NumericOperation.GREATER_OR_EQUAL, 'filter.operation.greater-or-equal'],
    [NumericOperation.LESS_OR_EQUAL, 'filter.operation.less-or-equal']
  ]
);

export enum BooleanOperation {
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL'
}

export const booleanOperationTranslationMap = new Map<BooleanOperation, string>(
  [
    [BooleanOperation.EQUAL, 'filter.operation.equal'],
    [BooleanOperation.NOT_EQUAL, 'filter.operation.not-equal']
  ]
);

export enum ComplexOperation {
  AND = 'AND',
  OR = 'OR'
}

export const complexOperationTranslationMap = new Map<ComplexOperation, string>(
  [
    [ComplexOperation.AND, 'filter.operation.and'],
    [ComplexOperation.OR, 'filter.operation.or']
  ]
);

export interface StringFilterPredicate {
  type: FilterPredicateType.STRING,
  operation: StringOperation;
  value: string;
  ignoreCase: boolean;
}

export interface NumericFilterPredicate {
  type: FilterPredicateType.NUMERIC,
  operation: NumericOperation;
  value: number;
}

export interface BooleanFilterPredicate {
  type: FilterPredicateType.BOOLEAN,
  operation: BooleanOperation;
  value: boolean;
}

export interface ComplexFilterPredicate {
  type: FilterPredicateType.COMPLEX,
  operation: ComplexOperation;
  predicates: Array<KeyFilterPredicate>;
}

export type KeyFilterPredicate = StringFilterPredicate |
  NumericFilterPredicate |
  BooleanFilterPredicate |
  ComplexFilterPredicate;

export interface KeyFilter {
  key: EntityKey;
  predicate: KeyFilterPredicate;
}

export interface KeyFilterInfo {
  key: EntityKey;
  valueType: EntityKeyValueType;
  predicates: Array<KeyFilterPredicate>;
}

export interface FilterInfo {
  filter: string;
  editable: boolean;
  keyFilters: Array<KeyFilterInfo>;
}

export interface FiltersInfo {
  datasourceFilters: {[datasourceIndex: number]: FilterInfo};
}

export function filterInfoToKeyFilters(filter: FilterInfo): Array<KeyFilter> {
  const keyFilterInfos = filter.keyFilters;
  const keyFilters: Array<KeyFilter> = [];
  for (const keyFilterInfo of keyFilterInfos) {
    const key = keyFilterInfo.key;
    for (const predicate of keyFilterInfo.predicates) {
      const keyFilter: KeyFilter = {
        key,
        predicate
      };
      keyFilters.push(keyFilter);
    }
  }
  return keyFilters;
}

export interface Filter extends FilterInfo {
  id: string;
}

export interface Filters {
  [id: string]: Filter
}

export interface EntityFilter extends EntityFilters {
  type?: AliasFilterType;
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface EntityDataSortOrder {
  key: EntityKey;
  direction: Direction;
}

export interface EntityDataPageLink {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortOrder?: EntityDataSortOrder;
  dynamic?: boolean;
}

export function entityDataPageLinkSortDirection(pageLink: EntityDataPageLink): SortDirection {
  if (pageLink.sortOrder) {
    return (pageLink.sortOrder.direction + '').toLowerCase() as SortDirection;
  } else {
    return '' as SortDirection;
  }
}

export function createDefaultEntityDataPageLink(pageSize: number): EntityDataPageLink {
  return {
    pageSize,
    page: 0,
    sortOrder: {
      key: {
        type: EntityKeyType.ENTITY_FIELD,
        key: 'createdTime'
      },
      direction: Direction.DESC
    }
  }
}

export const singleEntityDataPageLink: EntityDataPageLink = createDefaultEntityDataPageLink(1);
export const defaultEntityDataPageLink: EntityDataPageLink = createDefaultEntityDataPageLink(1024);

export interface EntityCountQuery {
  entityFilter: EntityFilter;
}

export interface EntityDataQuery extends EntityCountQuery {
  pageLink: EntityDataPageLink;
  entityFields?: Array<EntityKey>;
  latestValues?: Array<EntityKey>;
  keyFilters?: Array<KeyFilter>;
}

export interface TsValue {
  ts: number;
  value: string;
}

export interface EntityData {
  entityId: EntityId;
  latest: {[entityKeyType: string]: {[key: string]: TsValue}};
  timeseries: {[key: string]: Array<TsValue>};
}

export function entityPageDataChanged(prevPageData: PageData<EntityData>, nextPageData: PageData<EntityData>): boolean {
  const prevIds = prevPageData.data.map((entityData) => entityData.entityId.id);
  const nextIds = nextPageData.data.map((entityData) => entityData.entityId.id);
  return !isEqual(prevIds, nextIds);
}

export const entityInfoFields: EntityKey[] = [
  {
    type: EntityKeyType.ENTITY_FIELD,
    key: 'name'
  },
  {
    type: EntityKeyType.ENTITY_FIELD,
    key: 'label'
  }
];

export function entityDataToEntityInfo(entityData: EntityData): EntityInfo {
  const entityInfo: EntityInfo = {
    id: entityData.entityId.id,
    entityType: entityData.entityId.entityType as EntityType
  };
  if (entityData.latest && entityData.latest[EntityKeyType.ENTITY_FIELD]) {
    const fields = entityData.latest[EntityKeyType.ENTITY_FIELD];
    if (fields.name) {
      entityInfo.name = fields.name.value;
    } else {
      entityInfo.name = '';
    }
    if (fields.label) {
      entityInfo.label = fields.label.value;
    } else {
      entityInfo.label = '';
    }
    entityInfo.entityDescription = 'TODO: Not implemented';
  }
  return entityInfo;
}

export function updateDatasourceFromEntityInfo(datasource: Datasource, entity: EntityInfo, createFilter = false) {
  datasource.entity = {};
  datasource.entityId = entity.id;
  datasource.entityType = entity.entityType;
  if (datasource.type === DatasourceType.entity) {
    datasource.entityName = entity.name;
    datasource.entityLabel = entity.label;
    datasource.name = entity.name;
    datasource.entityDescription = entity.entityDescription;
    if (createFilter) {
      datasource.entityFilter = {
        type: AliasFilterType.singleEntity,
        singleEntity: {
          id: entity.id,
          entityType: entity.entityType
        }
      };
    }
  }
}