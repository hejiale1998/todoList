// var list = [{
//    title : "吃饭",
//    checked : true
// },{
//    title : "睡觉",
//    checked : false
// }]

var setLocal = {
    save(key,value){
       return localStorage.setItem(key,JSON.stringify(value));
    },
    get(key){
       return JSON.parse(localStorage.getItem(key));
    }
}

var filterChecked = {
    all(list){
        return list;
    },
    finish(list){
        return list.filter(function(item){
            return item.checked;
        })
    },
    unfinish(list){
        return list.filter(function(item){
            return !item.checked;
        })
    }
}
var list = setLocal.get("todo") || [];
 
var vm = new Vue({
	el : ".main",
    watch : {
        list : {
            deep : true,
            handler : function () {
                setLocal.save("todo",this.list);
            }
        }
    },
    data : {
    	list : list,
    	inputValue: "",
    	editingValue:"",
        visibility:"all"
    },
    computed : {
        filterList(){
            return this.list.filter(function(item){return !item.checked}).length;
        },
        filterCheck(){
            return filterChecked[this.visibility] ? filterChecked[this.visibility](this.list) : this.list;
        }
    },
    methods : {
    	addTodo() {
    		this.list.push({                 // 注意这个push方法是vue重写的一个方法，和原来的不一样，会改变原来的list
    			title : this.inputValue,
    			checked : false
    		})
    		this.inputValue = ""
    	},
    	deleteTodo(todo){
            // console.log(todo)
    		var index = this.list.indexOf(todo);     //第一个参数必需，需要检索的字符串值
    		this.list.splice(index,1);      //第一个参数是从哪截取，第二个是截取几位（用于删除元素）
    	},
    	editTodo(todo){
    		// console.log(todo)
            this.editingValue = todo;
            this.beforeEditing = todo.title;
    	},
        editedTodo(){
            this.editingValue = "";
        },
        cancelTodo(todo){
            todo.title = this.beforeEditing;
            this.beforeEditing = "";
            this.editingValue = "";           //置为空，跳出编辑的状态
        }
    },
    directives : {
        focus : {
            update(el, binding){
                if(binding.value) {
                    el.focus()
                }
            }
        }
    }
})


function hashchange() {
    hash = window.location.hash.slice(1);
    vm.visibility = hash;
    console.log(vm.visibility)
}

hashchange()
window.addEventListener("hashchange",hashchange);