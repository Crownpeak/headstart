export class DefaultSection{

    constructor(data){
        this.data = data;
    }

    render(){
        const section = document.createElement("section");
        section.innerHTML = JSON.stringify(this.data, null, 4);
        section.dataset.previewId = this.data.identifier;
        return section;
    }

}