function ready(){
	var app = new Vue({
		el: '#app',
		data: {
			types: ["Продукты", "Бытовая химия", "Товары для авто"],
			priceList: [
				{title: "Кофе", price: 55, type: 0, id: 0, view: false},
				{title: "Молоко", price: 40, type: 0, id: 1, view: false},
				{title: "Яйца", price: 40, type: 0, id: 2, view: false},
				{title: "Чай", price: 60, type: 0, id: 3, view: false},
				{title: "Печеньки", price: 150, type: 0, id: 4, view: false},
				{title: "Творог", price: 90, type: 0, id: 5, view: false},
				{title: "Гречка", price: 30, type: 0, id: 6, view: false},
				{title: "Торт", price: 450, type: 0, id: 7, view: false},
				{title: "Колбаса", price: 280, type: 0, id: 8, view: false},
				{title: "Зубная щетка", price: 140, type: 1, id: 9, view: false},
				{title: "Зубная паста", price: 100, type: 1, id: 10, view: false},
				{title: "Стиральный порошок", price: 540, type: 1, id: 11, view: false},
				{title: "Мыло", price: 40, type: 1, id: 12, view: false},
				{title: "Ароматизатор", price: 120, type: 2, id: 13, view: false},
				{title: "Влажные салфетки", price: 50, type: 2, id: 14, view: false},
				{title: "Шампунь", price: 250, type: 1, id: 15, view: false},
				{title: "Сыр", price: 230, type: 0, id: 16, view: false},
				{title: "Сок", price: 90, type: 0, id: 17, view: false}
			],
			purchases: [],
			list: [],
			basketShow: false,
			dragAndDrop: false,
			search: "",
			sum: 0,
			sortList: [
				{title: "по имени", val: true},
				{title: "по цене", val: false},
				{title: "по типу", val: false}
			],
			sortId: 0,
			grafShow: false,
			filtersShow: false,
			filters:{
				min: 0,
				max: 10000,
				showTypes: [true, true, true]
			},
			showTypes: false,
			showInfoForProduct: false,
			infoProduct:{
				title: "",
				info: "Описание",
				price: 0
			}
		},
		created: function(){
			this.list = this.priceList
			this.sortMyList();
		},
		computed: {
			bgMsg: function(){
				return this.basketShow ? "#e74c3c" : "#2ecc71";
			}
		},
		methods:{
			updateList: function(){
				this.basketShow = !this.basketShow;
				this.basketShow ? this.list = this.purchases : this.list = this.priceList;
				this.sortMyList();
			},
			bgGraf: function(type){
				switch(type){
					case 0:
						return "red";
					break;
					case 1:
						return "lime";
					break;
					case 2:
						return "blue";
					break;
				}
			},
			dragEnter: function(event){
				event.preventDefault();
				return true;
			},
			dragOver: function dragOver(event) {
				event.preventDefault();
			},
			setOrDelProduct: function(event){
				var id = event.dataTransfer.getData("Number");
				this.basketShow ? this.updateLists(id, this.priceList, this.purchases, (-1)) : this.updateLists(id, this.purchases, this.priceList, 1);
				return false;
			},
			updateLists: function(id, arrSet, arrDel, num){
				for(let i = 0; i < arrDel.length; i++){
					if(arrDel[i].id == id){
						id = i;
						break;
					}
				}
				arrSet.push(arrDel[id]);
				this.sum += arrDel[id].price*num;
				arrDel.splice(id, 1);
				this.list = arrDel;
				this.sortMyList();
			},
			dragStart: function(event, id) {
				event.dataTransfer.effectAllowed='move';
				event.dataTransfer.setData("Number", id);
				this.dragAndDrop = true;
				return true;
			},
			dragEnd: function(event){
				this.dragAndDrop = false;
			},
			filterList: function(){
				var 
					srch = this.search.toLowerCase(),
					arr = this.basketShow ? this.purchases : this.priceList,
					min = this.filters.min,
					max = this.filters.max,
					showTypes = this.filters.showTypes;
				return arr.filter(function(el){
					let 
						title = el.title.toLowerCase(),
						search = srch == "" ? true : title.indexOf(srch) > -1,
						types;

					for(let i = 0; i < showTypes.length; i++)
						if(el.type == i) types = showTypes[i];

					return el.price > min &&
					el.price <= max &&
					search &&
					types ?
					true :
					false;
				})
			},
			setNewSort: function(id){
				this.sortList[id].val = false;
				if(id == this.sortList.length-1) id = -1;
				this.sortList[id+1].val = true;
				this.sortId = id+1;
				this.sortMyList();
			},
			sortedList: function(a,b){ // compare функция
				switch(this.sortId){
					case 0:
						return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
					break;
					case 1:
						return a.price > b.price ? 1 : -1;
					break;
					case 2:
						return a.type > b.type ? 1 : -1;
					break;
				}
			},
			revList: function(){
				this.list.reverse();
			},
			sortMyList: function(){
				this.list = this.filterList();
				this.list.sort(this.sortedList);
			},
			infoForProduct: function(id){
				this.showInfoForProduct = true;
				for(let i = 0; i < this.list.length; i++){
					if(this.list[i].id == id){
						id = i;
						break;
					}
				}
				this.infoProduct.title = this.list[id].title;
				this.infoProduct.price = this.list[id].price;
				this.list[id].view = true;
			}
		}
	})
}

document.addEventListener("DOMContentLoaded", ready);