class Handler{  
    constructor(){
        this.wks = []
    }

    get size(){
        return this.wks.length
    }

    createWS(data) {           
        this.wks.push({
            name:data.name,
            layout:[]
        })            
    }
    
    renameWS(data, index){
        this.wks[index].name = data.name
    }

    deleteWS(index){
        this.wks.splice(index,1)        
        if(this.wks.length <= 0) 
            return -1
        else
            return this.wks.length-1        
    }

    findWS(obj){
       return this.wks.findIndex(element => element == obj)
    }

    findWC(obj, cellId){
        return obj.findIndex(element => element.id == cellId)        
    }

    searchWC(cellId){
        var Cindex = -1
        for (let index = 0; index < this.wks.length; index++) {
            Cindex = this.findWC(this.wks[index].layout, cellId)

            if(Cindex != -1){
                return this.wks[index].layout[Cindex]
            }            
        }

        return null
        
    }
    

    createWC(index, type){

        //generating new id by time
        var now = new Date                
        var nid = 'box_'+now.getTime()                                         
        var cp = {}
        if(type == 'Player'){
            cp.volumeState = 'mdi-volume-medium'
            cp.volume = 70
            cp.randomMode = false;
            cp.currentTime = 0
            cp.lopp = false
            cp.autoplay = false
        }

        this.wks[index].layout.push({            
            id: nid,
            hidden: false,
            pinned: false,
            position: {
                x: 50,
                y: 0,
                w: 3, 
                h: 2 
            },
            type:type,    
            contentsPresets:cp           
        })


        
    }

    deleteWC(WK, cellId){                
        WK.layout.splice(this.findWC(WK.layout, cellId), 1)
    }

    test(){
        return "veio até aqui mesmo!"
    }

}

export default new Handler();