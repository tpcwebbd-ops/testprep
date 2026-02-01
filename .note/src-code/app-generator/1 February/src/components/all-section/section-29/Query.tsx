/*
|-----------------------------------------
| setting up QuerySection28 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App-Generator, December, 2025
|-----------------------------------------
*/

import { defaultDataSection29, IDefaultDataSection29Props } from './data';

const QuerySection28 = ({ data }: IDefaultDataSection29Props) => {
  const finalData = {
    ...defaultDataSection29,
    ...(typeof data === 'string' ? JSON.parse(data) : {}),
  };
  const { height, width, background, display } = finalData;

  return (
    <div
      className={`
        ${height} 
        ${width} 
        ${background === 'transparent' ? 'bg-transparent' : background} 
        ${display}
      `}
    ></div>
  );
};

export default QuerySection28;
