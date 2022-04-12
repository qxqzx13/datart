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

import { FC, memo } from 'react';
import { FONT_SIZE_TITLE } from 'styles/StyleConstants';

const IconBox: FC<{
  iconName: string | undefined;
  size?: string;
  style?: any;
}> = memo(({ iconName, size = FONT_SIZE_TITLE, style }) => {
  const renderIcon = ({ ...args }: { iconStr; size; style }) => {
    if (/^<svg/.test(args?.iconStr) || /^<\?xml/.test(args?.iconStr)) {
      return <SVGImageRender {...args} />;
    }
    if (/svg\+xml;base64/.test(args?.iconStr)) {
      return <Base64ImageRender {...args} />;
    }
    return <SVGFontIconRender {...args} />;
  };

  return renderIcon({
    iconStr: iconName,
    size,
    style,
  });
});

export default IconBox;

const SVGFontIconRender = ({ iconStr, size, style }) => {
  return (
    <i
      className={`iconfont icon-${!iconStr ? 'chart' : iconStr}`}
      style={Object.assign({ fontSize: size, lineHeight: 1 }, style)}
    />
  );
};

const SVGImageRender = ({ iconStr, size, style }) => {
  return (
    <img
      alt="svg icon"
      style={Object.assign({ height: size, width: size }, style)}
      src={`data:image/svg+xml;utf8,${iconStr}`}
    />
  );
};

const Base64ImageRender = ({ iconStr, size, style }) => {
  return (
    <img
      alt="svg icon"
      style={Object.assign({ height: size, width: size }, style)}
      src={iconStr}
    />
  );
};
