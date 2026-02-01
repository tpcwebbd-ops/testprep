export interface IDefaultDataSection29 {
  height: string;
  width: string;
  background: string;
  display: string;
}

export interface IDefaultDataSection29Props {
  data?: IDefaultDataSection29 | string;
  onSubmit?: (values: IDefaultDataSection29) => void;
}

export const defaultDataSection29: IDefaultDataSection29 = {
  height: 'h-4',
  width: 'w-full',
  background: 'transparent',
  display: 'block',
};
