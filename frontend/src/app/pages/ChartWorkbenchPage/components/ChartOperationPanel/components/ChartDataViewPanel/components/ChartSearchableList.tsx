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

import { Divider, Input, List, Space } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import debounce from 'lodash/debounce';
import { FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

const ChartSearchableList: FC<{
  source: Array<{ value: string; label: string }>;
  onItemSelected: (itemKey) => void;
}> = memo(({ source, onItemSelected }) => {
  const [listItems, setListItmes] = useState(source);
  const [searchValue, setSearchValue] = useState<string>();
  const t = useI18NPrefix(`viz.workbench.dataview`);

  useEffect(() => {
    setSearchValue('');
    setListItmes(source);
  }, [source]);

  const handleListItemClick = itemKey => {
    onItemSelected(itemKey);
  };

  const handleSearch = debounce((value: string) => {
    setSearchValue(value);
    if (!value || !value.trim()) {
      setListItmes(source);
    }
    const newListItems = source?.filter(item =>
      item?.label.toUpperCase().includes(value.toUpperCase()),
    );
    setListItmes(newListItems);
  }, 100);

  return (
    <StyledChartSearchableList direction="vertical">
      <Input.Search
        value={searchValue}
        onChange={e => handleSearch(e.target.value)}
        enterButton
      />
      <Divider />
      <List
        className="searchable-list-container"
        dataSource={listItems}
        rowKey={item => item.value}
        renderItem={item => (
          <p onClick={() => handleListItemClick(item.value)}>{item.label}</p>
        )}
      />
    </StyledChartSearchableList>
  );
});

export default ChartSearchableList;

const StyledChartSearchableList = styled(Space)`
  .ant-list {
    overflow: auto;
  }

  .ant-divider {
    margin: 5px;
  }
`;
