/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConditionStyleFormValues } from 'app/components/FormGenerator/Customize/ConditionStylePanel';
import { OperatorTypes } from 'app/components/FormGenerator/Customize/ConditionStylePanel/types';
import { CSSProperties } from 'react';

const isMatchedTheCondition = (
  value: string | number,
  operatorType: OperatorTypes,
  conditionValues: string | number | (string | number)[],
) => {
  let matchTheCondition = false;

  switch (operatorType) {
    case OperatorTypes.Equal:
      matchTheCondition = value === conditionValues;
      break;
    case OperatorTypes.NotEqual:
      matchTheCondition = value !== conditionValues;
      break;
    case OperatorTypes.Contain:
      matchTheCondition = (value as string)?.includes(
        conditionValues as string,
      );
      break;
    case OperatorTypes.NotContain:
      matchTheCondition = !(value as string)?.includes(
        conditionValues as string,
      );
      break;
    case OperatorTypes.In:
      matchTheCondition = (conditionValues as (string | number)[])?.includes(
        value,
      );
      break;
    case OperatorTypes.NotIn:
      matchTheCondition = !(conditionValues as (string | number)[])?.includes(
        value,
      );
      break;
    case OperatorTypes.Between:
      const [min, max] = conditionValues as number[];
      matchTheCondition = value >= min && value <= max;
      break;
    case OperatorTypes.LessThan:
      matchTheCondition = value < conditionValues;
      break;
    case OperatorTypes.GreaterThan:
      matchTheCondition = value > conditionValues;
      break;
    case OperatorTypes.LessThanOrEqual:
      matchTheCondition = value <= conditionValues;
      break;
    case OperatorTypes.GreaterThanOrEqual:
      matchTheCondition = value >= conditionValues;
      break;
    case OperatorTypes.IsNull:
      if (typeof value === 'object' && value === null) {
        matchTheCondition = true;
      } else if (typeof value === 'string' && value === '') {
        matchTheCondition = true;
      } else if (typeof value === 'undefined') {
        matchTheCondition = true;
      } else {
        matchTheCondition = false;
      }
      break;
    default:
      break;
  }
  return matchTheCondition;
};

const getTheSameRange = (list, type) =>
  list?.filter(item => item?.range === type);

const deleteUndefinedProps = props => {
  return Object.keys(props).reduce((acc, cur) => {
    if (props[cur] !== undefined || props[cur] !== null) {
      acc[cur] = props[cur];
    }
    return acc;
  }, {});
};

export const getCustomBodyCellStyle = (
  cellValue: any,
  conditionStyle: ConditionStyleFormValues[],
): CSSProperties => {
  const currentConfigs = getTheSameRange(conditionStyle, 'cell');
  if (!currentConfigs?.length) {
    return {};
  }
  const text = cellValue;
  let cellStyle: CSSProperties = {};

  try {
    currentConfigs?.forEach(
      ({ operator, value, color: { background, textColor: color } }) => {
        cellStyle = isMatchedTheCondition(text, operator, value)
          ? { backgroundColor: background, color }
          : cellStyle;
      },
    );
  } catch (error) {
    console.error('getCustomBodyCellStyle | error ', error);
  }
  return deleteUndefinedProps(cellStyle);
};

export const getCustomBodyRowStyle = (
  rowRecord: { [k in string]: any },
  conditionStyle: ConditionStyleFormValues[],
): CSSProperties => {
  const currentConfigs: ConditionStyleFormValues[] = getTheSameRange(
    conditionStyle,
    'row',
  );
  if (!currentConfigs?.length) {
    return {};
  }
  let rowStyle: CSSProperties = {};

  try {
    currentConfigs?.forEach(
      ({
        operator,
        value,
        color: { background, textColor },
        target: { name },
      }) => {
        rowStyle = isMatchedTheCondition(rowRecord?.[name], operator, value)
          ? { backgroundColor: background, color: textColor }
          : rowStyle;
      },
    );
  } catch (error) {
    console.error('getCustomBodyRowStyle | error ', error);
  }
  return deleteUndefinedProps(rowStyle);
};
