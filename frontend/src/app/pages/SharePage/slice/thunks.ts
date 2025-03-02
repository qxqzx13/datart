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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartDataRequestBuilder';
import { handleServerBoardAction } from 'app/pages/DashBoardPage/pages/Board/slice/asyncActions';
import {
  ServerDashboard,
  VizRenderMode,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ChartPreview,
  FilterSearchParams,
} from 'app/pages/MainPage/pages/VizPage/slice/types';
import { handleServerStoryAction } from 'app/pages/StoryBoardPage/slice/actions';
import { ServerStoryBoard } from 'app/pages/StoryBoardPage/slice/types';
import { convertToChartDTO } from 'app/utils/ChartDtoHelper';
import { RootState } from 'types';
import persistence from 'utils/persistence';
import { request, request2 } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { shareActions } from '.';
import { ShareVizInfo } from './types';

export const fetchShareVizInfo = createAsyncThunk(
  'share/fetchShareVizInfo',
  async (
    {
      shareToken,
      sharePassword,
      filterSearchParams,
      renderMode,
    }: {
      shareToken?: string;
      sharePassword?: string;
      filterSearchParams?: FilterSearchParams;
      renderMode?: VizRenderMode;
    },
    thunkAPI,
  ) => {
    let data = {} as any;
    try {
      const response = await request<ShareVizInfo>({
        url: '/share/viz',
        method: 'GET',
        params: {
          shareToken,
          password: sharePassword,
        },
      });
      data = response.data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
    await thunkAPI.dispatch(shareActions.setVizType(data.vizType));
    persistence.session.save(shareToken, sharePassword);
    await thunkAPI.dispatch(shareActions.saveNeedPassword(false));
    await thunkAPI.dispatch(
      shareActions.saveShareInfo({ token: shareToken, pwd: sharePassword }),
    );

    await thunkAPI.dispatch(
      shareActions.setExecuteTokenMap({
        executeToken: data.executeToken,
      }),
    );

    switch (data.vizType) {
      case 'DATACHART':
        const shareVizInfo = {
          ...data,
          vizDetail: convertToChartDTO(data.vizDetail),
        };
        thunkAPI.dispatch(
          shareActions.setDataChart({ data: shareVizInfo, filterSearchParams }),
        );
        break;
      case 'DASHBOARD':
        const serverBoard = data.vizDetail as ServerDashboard;
        // setExecuteTokenMap
        thunkAPI.dispatch(
          handleServerBoardAction({
            data: serverBoard,
            renderMode: renderMode || 'share',
            filterSearchMap: {
              params: filterSearchParams,
              isMatchByName: true,
            },
          }),
        );
        break;
      case 'STORYBOARD':
        thunkAPI.dispatch(
          shareActions.setSubVizTokenMap({
            subVizToken: data.subVizToken,
          }),
        );

        thunkAPI.dispatch(
          handleServerStoryAction({
            data: data.vizDetail as ServerStoryBoard,
            renderMode: 'read',
            storyId: data.vizDetail.id,
          }),
        );
        break;
      default:
        break;
    }
    return { data, filterSearchParams };
  },
);

export const fetchShareDataSetByPreviewChartAction = createAsyncThunk(
  'share/fetchDataSetByPreviewChartAction',
  async (
    args: {
      preview: ChartPreview;
      pageInfo?: any;
      sorter?: { column: string; operator: string; aggOperator?: string };
    },
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as RootState;
    const shareState = state.share;
    const builder = new ChartDataRequestBuilder(
      {
        id: args.preview?.backendChart?.viewId,
        computedFields:
          args.preview?.backendChart?.config?.computedFields || [],
      } as any,
      args.preview?.chartConfig?.datas,
      args.preview?.chartConfig?.settings,
      args.pageInfo,
      false,
      args.preview?.backendChart?.config?.aggregation,
    );
    const response = await request2({
      method: 'POST',
      url: `share/execute`,
      params: {
        executeToken: shareState?.executeToken,
        password: shareState?.sharePassword,
      },
      data: builder
        .addExtraSorters(args?.sorter ? [args?.sorter as any] : [])
        .build(),
    });
    return response.data;
  },
);

export const updateFilterAndFetchDatasetForShare = createAsyncThunk(
  'share/updateFilterAndFetchDatasetForShare',
  async (
    arg: { backendChartId: string; chartPreview?: ChartPreview; payload },
    thunkAPI,
  ) => {
    await thunkAPI.dispatch(
      shareActions.updateChartPreviewFilter({
        backendChartId: arg.backendChartId,
        payload: arg.payload,
      }),
    );
    const state = thunkAPI.getState() as RootState;
    const shareState = state.share;
    await thunkAPI.dispatch(
      fetchShareDataSetByPreviewChartAction({
        preview: shareState?.chartPreview!,
      }),
    );
    return {
      backendChartId: arg.backendChartId,
    };
  },
);
