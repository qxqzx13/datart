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
import { BoardTypeMap } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getInitBoardConfig } from 'app/pages/DashBoardPage/utils/board';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInsertedNodeIndex } from 'utils/utils';
import { SaveFormModel } from '../SaveFormContext';
import { selectVizs } from '../slice/selectors';
import { addViz } from '../slice/thunks';
import { Folder, VizType } from '../slice/types';

export interface addVizParams {
  vizType: VizType;
  type: CommonFormTypes;
  visible: boolean;
  initialValues: any;
  callback?: (folder?: Folder) => void;
}

/**
 * Creat vizs
 *
 */

export function useAddViz({ showSaveForm }) {
  const vizsData = useSelector(selectVizs);
  const dispatch: (any) => Promise<any> = useDispatch();
  const orgId = useSelector(selectOrgId);

  const updateValue = useCallback((relType: VizType, values: SaveFormModel) => {
    const dataValues = values;
    if (relType === 'DASHBOARD') {
      try {
        dataValues.config = JSON.stringify(
          getInitBoardConfig(values.boardType || BoardTypeMap.auto),
        );
      } catch (error) {
        throw error;
      }
    }
    return dataValues;
  }, []);

  const addVizFn = useCallback(
    ({ vizType, type, visible, initialValues, callback }: addVizParams) => {
      showSaveForm({
        vizType: vizType,
        type: type,
        visible: visible,
        initialValues: initialValues,
        onSave: async (values: SaveFormModel, onClose) => {
          const dataValues = updateValue(vizType, values);
          let index = getInsertedNodeIndex(values, vizsData);
          let vizData = await dispatch(
            addViz({
              viz: {
                ...initialValues,
                ...dataValues,
                orgId: orgId,
                index: index,
              },
              type: vizType,
            }),
          );
          if (!vizData.error) {
            callback?.(vizData.payload);
            onClose();
          }
        },
      });
    },
    [showSaveForm, vizsData, dispatch, orgId, updateValue],
  );

  return addVizFn;
}
