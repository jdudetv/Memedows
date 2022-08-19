import { observable } from "mobx";

export class UIStore {
  @observable coverWindow = false;
  @observable startMenuVisible = false;
}
