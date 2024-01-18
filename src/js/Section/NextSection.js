import { App } from "../App";

export class NextSection {
  constructor() {
    this.render();
  }

  render() {
    if (App.caasConnection && App.navigationService) {
        document.getElementById("next-headline").classList.remove("hidden");
        document.getElementById("next-content").classList.remove("hidden");      
    } else {
        document.getElementById("next-headline").classList.add("hidden");
        document.getElementById("next-content").classList.add("hidden");
    }
  }
}
