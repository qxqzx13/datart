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

import { DownloadFileType } from 'app/constants';
import { generateShareLinkAsync } from 'app/utils/fetch';
import { createContext, FC, memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectVizs } from '../../../MainPage/pages/VizPage/slice/selectors';
import { BOARD_UNDO } from '../../constants';
import { boardDownLoadAction } from '../../pages/Board/slice/asyncActions';
import { selectShareBoardInfo } from '../../pages/Board/slice/selector';
import { fetchBoardDetail } from '../../pages/Board/slice/thunk';
import { editBoardStackActions } from '../../pages/BoardEditor/slice';
import { clearEditBoardState } from '../../pages/BoardEditor/slice/actions/actions';
import { toUpdateDashboard } from '../../pages/BoardEditor/slice/thunk';
export interface BoardActionContextProps {
  // read
  onGenerateShareLink?: (date, usePwd) => any;
  onBoardToDownLoad: (downloadType: DownloadFileType) => any;
  // edit
  updateBoard?: (callback?: () => void) => void;
  boardToggleAllowOverlap: (allow: boolean) => void;
  onCloseBoardEditor: (boardId: string) => void;
  undo: () => void;
  redo: () => void;
}
export const BoardActionContext = createContext<BoardActionContextProps>(
  {} as BoardActionContextProps,
);
export const BoardActionProvider: FC<{
  boardId: string;
}> = memo(({ boardId, children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const vizs = useSelector(selectVizs);
  const shareBoardInfo = useSelector(selectShareBoardInfo);
  const { boardWidthHeight } = shareBoardInfo;

  const actions = useMemo(() => {
    const actionObj: BoardActionContextProps = {
      updateBoard: (callback?: () => void) => {
        dispatch(toUpdateDashboard({ boardId, callback }));
      },
      boardToggleAllowOverlap: (allow: boolean) => {
        dispatch(editBoardStackActions.toggleAllowOverlap(allow));
      },
      onGenerateShareLink: async (expireDate, enablePassword) => {
        const result = await generateShareLinkAsync(
          expireDate,
          enablePassword,
          boardId,
          'DASHBOARD',
        );
        return result;
      },
      onBoardToDownLoad: downloadType => {
        const folderId = vizs.filter(v => v.relId === boardId)[0].id;

        dispatch(
          boardDownLoadAction({
            boardId,
            downloadType,
            folderId,
            imageWidth: boardWidthHeight[0],
          }),
        );
      },
      onCloseBoardEditor: (boardId: string) => {
        const pathName = history.location.pathname;
        const prePath = pathName.split('/boardEditor')[0];
        history.push(`${prePath}`);
        dispatch(clearEditBoardState());
        // 更新view界面数据
        dispatch(fetchBoardDetail({ dashboardRelId: boardId }));
      },
      undo: () => {
        dispatch({ type: BOARD_UNDO.undo });
      },
      redo: () => {
        dispatch({ type: BOARD_UNDO.redo });
      },
    };
    return actionObj;
  }, [boardId, dispatch, history, vizs, boardWidthHeight]);
  return (
    <BoardActionContext.Provider value={actions}>
      {children}
    </BoardActionContext.Provider>
  );
});
