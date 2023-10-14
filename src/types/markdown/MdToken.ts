export interface MdToken {
  attrs: string[][];
  block: boolean;
  children: MdToken[];
  content: string;
  hidden: boolean;
  info: string;
  level: number;
  map: number[];
  markup: string;
  meta: any;
  nesting: number;
  tag: string;
  type: string;
}
