import { DOMHelper } from "../Utility/DOMHelper";

export class Modal{
    static modal;

    constructor(){
        this.modalElement = document.querySelector("#app-modal");
        if(!this.modalElement){
            const appElement = document.querySelector("#app");
            this.modalElement = DOMHelper.htmlToElement(this.html());
            const closeButton = this.modalElement.querySelector("button");
            closeButton.addEventListener("click", () => {
                this.hide();
            });
            const modalBackground = this.modalElement.querySelector("[data-modal-background]");
            modalBackground.addEventListener("click", () => {
                this.hide();
            });
            appElement.appendChild(this.modalElement);
        }        
    }

    static instance() {
        if (!this.modal) {
            this.modal = new Modal();
        }
        return this.modal;
    }

    show(content){
        console.log("show modal", content);
        const contentDiv = this.modalElement.querySelector(".content-tabs > div");
        contentDiv.replaceChildren(content);        
        this.modalElement.classList.remove("hidden"); 
    }

    hide(){
        this.modalElement.classList.toggle("hidden");
    }

    html(){
        return `<div id="app-modal" class="fixed inset-0 z-50 hidden">
                    <div class="absolute w-full h-full bg-gray-900 opacity-50" data-modal-background></div>
                    <div tabindex="-1"
                    class="flex w-full md:inset-0 h-full p-4 items-center justify-center overflow-x-hidden overflow-y-auto ">
                    <div class="relative w-full max-w-7xl max-h-full">
                        <!-- Modal content -->
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                            DEV Dialog
                            </h3>
                            <button type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="extralarge-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-6 space-y-6 bg-white">
                            <!--Tabs navigation
                                <ul class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0" role="tablist" data-te-nav-ref>
                                    <li role="presentation">
                                        <a href="#tabs-home"
                                        class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                                        data-te-toggle="pill" data-te-target="#tabs-home" data-te-nav-active role="tab"
                                        aria-controls="tabs-home" aria-selected="true">JSON</a>
                                    </li>
                                </ul>
                            -->
            
                            <!--Tabs content-->
                            <div class="content-tabs mb-6">
                                <div class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                                    id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab" data-te-tab-active>
                                    Tab 1 content
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>`;      
    }

}