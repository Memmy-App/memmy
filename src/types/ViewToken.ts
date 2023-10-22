export interface ViewToken<T> {
  item?: T;
  key: string;
  index?: number;
  isViewable: boolean;
  timestamp: number;
}

export interface ViewableItemsChanged<T> {
  viewableItems?: Array<ViewToken<T>>;
  changed: Array<ViewToken<T>>;
}
