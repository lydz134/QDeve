<template>
	<view>
		<view :animation="animationData" class="page" v-if="show" :style="{'display':show_index == 0 ?'block':'none'}" >
			<iteration></iteration> 
		</view>
		<view :animation="animationData" class="page" v-if="show" :style="{'display':show_index == 1 ?'block':'none'}" >
			<demand-pool></demand-pool>
		</view>
		<view :animation="animationData" class="page" v-if="show" :style="{'display':show_index == 2 ?'block':'none'}" >
			<project-member></project-member>
		</view>
		<view :animation="animationTab" class="my-tabbar" >
			<view v-for="tab in tabbar_list" :key="tab.id" :style="{'color':show_index == tab.id?'#076bf5':'#000000'}"  @tap="clickTab(tab.id)" class="my-tab">{{tab.name}}</view>
		</view>
		 <view style="width: 100%;height:94rpx;">
		 	<text> </text>
		 </view>
	</view> 
</template>
<script>
	import demandPool from '../../components/demandpool/demandpool.vue'
	import iteration from '../../components/iteration/iteration.vue'
	import projectMember from '../../components/projectmember/projectmember.vue'
	export default {
		components: {
			demandPool, 
			iteration,
			projectMember
		},
		data() {
			return {
				show: true,
				animationData: {},
				animationTab: {},
				show_index:0,//控制页面的显示
				tabbar_list :[{'id':0,'name':'迭代'},{'id':1,'name':'需求'},{'id':2,'name':'成员'}]//底部菜单
			}
		},
		onShow() {
			var animation = uni.createAnimation({
				duration:1000,
				timingFunction: 'ease',
			})
			this.animation = animation 
			setTimeout(function() {
			  animation.opacity(1).step()
			  this.animationData = animation.export()
			}.bind(this), 1000)
			setTimeout(function() {
			  animation.opacity(1).step()
			  this.animationTab = animation.export()
			}.bind(this), 500)
		},
		methods:{
			clickTab(id){
				this.show_index = id;
				this.show = false;
				this.$nextTick(() => {	
					this.show = true;
				})
			}
		}
	}
</script>

<style>
	.page{
		opacity: 0;
	}
	.my-tabbar{
		opacity: 0;
		background:#FFF; 
		background-color: white; 
		width: 750rpx;
		bottom: 0;
		border-top: 1rpx solid #e2e2e2;
		position: fixed;
	}
	.my-tab{
		width: 33.3%;
		padding: 24rpx 0;
		font-size: 30rpx;
		float: left;
		text-align: center;
	}
</style>
