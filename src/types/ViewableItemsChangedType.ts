import ViewToken from "@src/types/ViewToken";

export default interface ViewableItemsChangedType<T> {
  viewableItems?: ViewToken<T>[];
  changed: ViewToken<T>[];
}
