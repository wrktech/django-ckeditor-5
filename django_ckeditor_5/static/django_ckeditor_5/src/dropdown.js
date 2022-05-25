import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import Model from "@ckeditor/ckeditor5-ui/src/model";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import {
  addListToDropdown,
  createDropdown
} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import SplitButtonView from "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview";

function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();

          // Range.createContextualFragment() would be useful here but is
          // only relatively recently standardized and is not supported in
          // some browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(), node, lastNode;
          while ( (node = el.firstChild) ) {
              lastNode = frag.appendChild(node);
          }
          var firstNode = frag.firstChild;
          range.insertNode(frag);
          
          // Preserve the selection
          if (lastNode) {
              range = range.cloneRange();
              range.setStartAfter(lastNode);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
          }
      }
    }
};

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
      dropdownView.on('execute', (eventInfo) => {
        const { label } = eventInfo.source;
        pasteHtmlAtCaret(`<p>{{${label}}}</p>`)
      });
      addListToDropdown(dropdownView, items);

      return dropdownView;
    });
  }
}