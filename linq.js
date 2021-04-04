//collection methods like LINQ of C#
export class Linq {
    constructor(array){
        this.array = array
    }

    any(test){
        for(let i=0; i<this.array.length; i++){
            if(test(this.array[i],i)) return true
        }
        return false
    }

    all(test){
        for(let i=0; i<this.array.length; i++){
            if(!test(this.array[i],i)) return false
        }
        return true
    }

    count(){
        return this.array.length
    }

    sum(targetIs){
        let sum = 0
        this.array.forEach(x=>{
            sum += (targetIs==undefined) ? x : targetIs(x)
        })
        return sum
    }

    min(targetIs){
        let min = null
        this.array.forEach(x=>{
            let v = (targetIs==undefined) ? x : targetIs(x)
            if(min==null || v < min){
                min = v
            }
        })
        return min
    }

    max(targetIs){
        let max = null
        this.array.forEach(x=>{
            let v = (targetIs==undefined) ? x : targetIs(x)
            if(max==null || v > max){
                max = v
            }
        })
        return max
    }

    first(test){
        if(test==undefined){
            return this.array.length>0 ? this.array[0] : null
        }
        for(let i=0; i<this.array.length; i++){
            if(test(this.array[i])) return this.array[i]
        }
        return null
    }

    last(test){
        if(test==undefined){
            return this.array.length>0 ? this.array[this.array.length-1] : null
        }
        for(let i=this.array.length-1; i>=0; i--){
            if(test(this.array[i])) return this.array[i]
        }
        return null
    }
    
    select(itemIs){
        let ret = []
        this.array.forEach(x=>{
            ret.push(itemIs(x))
        })
        return new Linq(ret)
    }
    
    where(test){
        let ret = []
        this.array.forEach(x=>{
            if(test(x)) ret.push(x)
        })
        return new Linq(ret)
    }

    skip(count){
        let ret = []
        for(let i=count; i<this.array.length; i++){
            ret.push(this.array[i])
        }
        return new Linq(ret)
    }

    take(count){
        let ret = []
        for(let i=0; i<Math.min(this.array.length, count); i++){
            ret.push(this.array[i])
        }
        return new Linq(ret)
    }

    order(order){
        let ret = this.array.concat()
        const desc = order && order.startsWith("d")
        ret.sort((x,y)=>{
            if(x > y) return !desc ? 1 : -1
            if(x < y) return !desc ? -1 : 1
            return 0
        })
        return new Linq(ret)
    }

    orderBy(...order){
        for(let i=1; i<order.length; i+=2){
            order[i] = order[i].startsWith("d")
        }
        let ret = this.array.concat()
        ret.sort((x,y)=>{
            for(let i=0; i<order.length; i+=2){
                let key = order[i]
                let desc = order[i+1]
                if(x[key] > y[key]) return !desc ? 1 : -1
                if(x[key] < y[key]) return !desc ? -1 : 1
            }
            return 0
        })
        return new Linq(ret)
    }

    distinct(){
        let set = new Set()
        let ret = []
        this.array.forEach(x=>{
            if(!set.has(x)){
                set.add(x)
                ret.push(x)
            }
        })
        return new Linq(ret)
    }

    leftOuterJoin(joinArray, as, on){
        let ret = []
        this.array.forEach(x=>{
            let isJoin = false
            joinArray.forEach(y=>{
                if(on(x,y)){
                    let obj = {...x}
                    obj[as] = y
                    ret.push(obj)
                    isJoin = true
                }
            })
            if(!isJoin){
                let obj = {...x}
                obj[as] = null
                ret.push(obj)
            }
        })
        return new Linq(ret)
    }

    innerJoin(joinArray, as, on){
        let ret = []
        this.array.forEach(x=>{
            joinArray.forEach(y=>{
                if(on(x,y)){
                    let obj = {...x}
                    obj[as] = y
                    ret.push(obj)
                }
            })
        })
        return new Linq(ret)
    }

    groupBy(keyIs){
        let hash = {}
        
        this.array.forEach(x=>{
            let key = keyIs(x)
            if(!(key in hash)){
                hash[key] = []
            }
            hash[key].push(x)
        })

        let ret = []
        Object.keys(hash).forEach(key=>{
            ret.push(new Linq(hash[key]))
        })
        return new Linq(ret)
    }
}