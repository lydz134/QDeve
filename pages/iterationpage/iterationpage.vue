<template>
	<view>
		<view :animation="animationData" class="page" :style="{'display':show_index == 0 ?'block':'none'}" >
			<iteration-demand-pool></iteration-demand-pool>
		</view> 
		<view :animation="animationData" class="page" :style="{'display':show_index == 1 ?'block':'none'}" >
			<view class="intro">
				<view class="info">
					<view class="button" style="cursor: none;"><view>-</view></view>
					<view class="text">迭代进度</view>
					<view class="button" style="cursor: none;"><view>-</view></view>
				</view>
			</view>
			<view class="qiun-columns">
				<view class="qiun-charts" >
					<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
				</view>
			</view>
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
	import iterationDemandPool from '../../components/iterationdemandpool/iterationdemandpool.vue'
	import uCharts from '../../components/u-charts/u-charts.js';
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	// 定义全局变量
	var _self;
	var canvaLineA=null;
	export default {
		components: {
			iterationDemandPool,
		},
		computed: {
		    ...mapState(['iteration'])
		},
		data() {
			return {
				iterationDemandList:[],
				animationData: {},
				animationTab: {},
				show_index:0,//控制页面的显示
				tabbar_list :[{'id':0,'name':'迭代'},{'id':1,'name':'进程'}],//底部菜单
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				minusDays:0
			}
		},
		// 页面加载执行的函数
		onLoad() {
			_self = this;
			// uni.upx2px(750) 这是uni-app自带的自适应，以750的尺寸为基准。动态变化
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
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
				if(id == 1){
					this.getServerData();
				}
			},
			// 获取数据，发请求
			getServerData(){
				const startTime = _self.iteration.startTime
				let dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
				let minusDays = Math.floor((((new Date(_self.iteration.endTime)).getTime() - (new Date(_self.iteration.startTime)).getTime()) / dateTime));
				_self.demandCount = _self.iterationDemandList.length
				uniCloud.callFunction({
				    name: 'getIterationDemand',
				    data: {
						uniIdToken:this.uniIdToken,
						iterationId:this.iteration._id,
						isLeader:true
					}, 
					success(res){
						_self.iterationDemandList = res.result.data
						let temp = []
						for(var i = 0;i < (minusDays+1); i ++){
							temp.push(0)
						}
						for(var i = 0;i < _self.iterationDemandList.length; i ++){
							if(_self.iterationDemandList[i].state == '1'){
								let index = Math.floor((((new Date(_self.iterationDemandList[i].finishTime)).getTime() - (new Date(startTime)).getTime()) / dateTime));
								if((index >= 0) && (index <= minusDays)){
									temp[index] = temp[index] + 1
								}
							}
						}
						
						for(var i = 1;i < (minusDays+1); i ++){
							temp[i] = temp[i] + temp[i-1]
						}
						for(var i = 0;i < (minusDays+1); i ++){
							temp[i] = _self.iterationDemandList.length - temp[i]
						}
						let tempCategories = []
						for(var i = 0;i < (minusDays+1); i ++){
							tempCategories[i] = i + ''
						}
						
						let LineA={categories:[],series:[]};
						LineA.categories = tempCategories;
						LineA.series=[{
							name:"未完成任务",
							data:temp,
							color:'#409eff'
						}];
						_self.showLineA("canvasLineA",LineA);
					}
				});
			},
			// 展示图标的函数 接收参数，一个块的id,一个数据
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					// 图标类型
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:false,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					// x轴显示的内容
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8
					},
					// y轴显示的内容
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:0,
						max:_self.minusDays,
						format:(val)=>{return val.toFixed(0)}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			// 点击图表显示的内容
			touchLineA(e) {
				// 使用声明的变量canvaLineA
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return item.name + ':' + item.data 
					}
				});
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
		width: 50%;
		padding: 24rpx 0;
		font-size: 30rpx;
		float: left;
		text-align: center;
	}
	.qiun-charts {
		margin-top: 30rpx;
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
