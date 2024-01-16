import { App } from "../App";
import { DOMHelper } from "../Utility/DOMHelper";
export class Navigation {
  
  constructor() {
    this.nav = document.querySelector("#nav-menu");    
  }

  render() {
    if (App.router) {
      const topLevel = App.router.getTopLevel();      
      this.nav.replaceChildren();
      topLevel.forEach(this.appendNavItems);
    }
  }

  appendNavItems = (element) => {    
    this.nav.appendChild(this.createNavListItem(element, ["mb-3", "px-2", "mb-0"]));    
  }

  createNavListItem(itemInfo, cssClasses) {
    const li = document.createElement("li");
    DOMHelper.setCSSClass(li, cssClasses, []);    
    const link = document.createElement("a");
    DOMHelper.setCSSClass(link, ["inline-block", "text-sm", "text-gray-900", "hover:text-pink-900", "font-medium"], []);
    link.href = itemInfo.seoRoute;
    link.innerText = itemInfo.label;
    link.setAttribute("data-link","");
    li.appendChild(link);
    return li;
  };
}
