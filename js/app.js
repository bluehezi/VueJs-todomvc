(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	var app = new Vue({
		el : '#app',
		data : {
			todos:[],            // todo列表
			newtodo:'',          // 新的todo
			curEditing : -1,     // 当前正在被编辑的todo索引
			selectedAll : false, // 当前是否被全选
			selector : ''         
		},
		methods : {
			// 添加新的todo
			addNewTodo : function(){
				if(!this.newtodo){
					return;
				}
				this.todos.push({
					text:this.newtodo,
					completed:false
				});
				this.newtodo = '';
				// 保存到本地
				this.saveLocal();
			},
			// 移除某个todo
			removeTodo : function(index){
				this.todos.splice(index,1);
				// 保存到本地
				this.saveLocal();
			},
			// 编辑某个todo
			editing : function(index){
				if(this.todos[index].completed){
					return;
				}
				this.curEditing = index;
			},
			// 编辑后保存
			save:function(){
				this.curEditing=-1;
				// 保存到本地
				this.saveLocal();
			},
			// 清楚所有的已完成todo
			clearComputedItems : function(){
				this.todos = this.todos.filter(function(v,i,originArr) {
					return !v.completed;
				});
				// 保存到本地
				this.saveLocal();
			},
			// 切换全选/非全选
			toggleAll : function(){
				this.selectedAll = !this.selectedAll;

				this.todos.forEach(function(value){
					value.completed = this.selectedAll;
				},this);
				// 保存到本地
				this.saveLocal();
			},
			filterShow : function(hash){
				switch(hash){
					case '#/':
						this.selector = '';
						break;
					case '#/active':
						this.selector = false;
						break;
					case '#/completed':
					this.selector = true;
						break;
					default:
						break;
				}
			},
			// 存储任务列表在本地
			saveLocal : function(){
				var storage = window.localStorage;
				storage.setItem('todos',JSON.stringify(this.todos));
			},
			// 从本地获取任务列表
			getLocal : function(){
				if(this.todos.length === 0){
					var storage = window.localStorage;
					var data = storage.getItem('todos');
					if(data){
						this.todos = JSON.parse(data);
					}
				}
			}
		},
		computed : {
			// 剩余未完成todo的个数
			itemsLeft : function(){
				var i = 0;
				this.todos.forEach(function(v){
					if(!v.completed){
						i++;
					}
				});
				// 当所有的todos不是全部完成时，更新全选按钮的状态为未选中状态
				if(0!==i){
					this.selectedAll = false;
				}
				return i;
			},
			// 过滤显示的todo
			filterTodos : function(){
				this.getLocal();
				var list = this.todos;
				if(this.selector === ''){
					return list;
				}
				return list.filter(function(v){
					return this.selector === v.completed;
				},this);
			}
		}
	})
	window.app = app;
})(window);
