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

import { createContext } from 'react';
import { Widget } from '../pages/Board/slice/types';
export interface BoardActionContextProps {
  widgetUpdate: (widget: Widget) => void;
  refreshWidgetsByController: (widget: Widget) => void;
  updateBoard?: (callback: () => void) => void;
  onGenerateShareLink?: (date, usePwd) => any;
  onBoardToDownLoad: () => any;
  onWidgetsQuery: () => any;
  onWidgetsReset: () => any;
  onSaveAsVizs: () => any;
}
export const BoardActionContext = createContext<BoardActionContextProps>(
  {} as BoardActionContextProps,
);
