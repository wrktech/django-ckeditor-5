import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Model from "@ckeditor/ckeditor5-ui/src/model";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import {
  addListToDropdown,
  createDropdown
} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import SplitButtonView from "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview";

export default class InsertDropDown extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("InsertDropDown", locale => {
      const dropdownView = createDropdown(locale, SplitButtonView);
      dropdownView.buttonView.actionView.set({
        withText: true,
        label: "choose variable",
        icon: imageIcon,
        tooltip: true
      });
      //
      const items = new Collection();

      items.add({
        type: "button",
        model: new Model({
          withText: true,
          label: "Foo"
        })
      });

      items.add({
        type: "button",
        model: new Model({
          withText: true,
          label: "Bar"
        })
      });      
      addListToDropdown(dropdownView, items);

      return dropdownView;
    });
  }
}