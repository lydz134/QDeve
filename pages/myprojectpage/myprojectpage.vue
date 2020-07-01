<template>
	<view>
		<view class="uni-padding-wrap">
			<view>
				<view class="uni-list">
					<checkbox-group >
						<label class="uni-list-cell uni-list-cell-pd project-list" v-if="isListShow" v-for="project in projectList" @click="enterProject(project.isLeader,project.project[0])" :key="project._id">
							<view >{{project.project[0].projectName}}</view> 
							<view v-if="project.isLeader == true" class="tag-view">
								<uni-tag :inverted="true" text="负责人" type="primary" size="small" />
							</view>
							<view v-if="project.isLeader == false" class="tag-view">
								<uni-tag :inverted="true" text="成员" type="success" size="small" />
							</view>
						</label>
						
					</checkbox-group>
				</view>
			</view>
			<view style="width: 100%;height:94rpx;">
				<text> </text>
			</view>
		</view>
		<view class="my-tabbar" @click="backToHomePage">
			<view class="my-tab">首页</view>
		</view>
		
	</view> 
</template>
<script>
	import uniList from '../../components/uni-list/uni-list.vue' 
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue' 
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			uniList,
			uniListItem,
			uniPopup,
			uniTag
		},
		data() {
			return {
				isListShow:true,
				animationData: {},
				projectList:[]
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
		},
		onLoad() {
			let th = this
			try {
			    const uniIdToken = uni.getStorageSync('uniIdToken');
			} catch (e) {
			    // error
			};
			uniCloud.callFunction({
			    name: 'getProject',
			    data: {
					uniIdToken:this.uniIdToken
				},
				success(res){
					th.projectList = res.result.data
				}
			});
			
			
		},
		methods:{
			...mapMutations(['setIsLeader','setProject']),
			enterProject(isLeader,project){
				let th = this
				uni.navigateTo({
					url:'../projectpage/projectpage',
					success() {
						th.setIsLeader(isLeader)
						th.setProject(project)
					}
				})
			},
			backToHomePage(){
				uni.navigateTo({
					url:'../homepage/homepage'
				})
			}
		},
		
	}
</script>

<style>
	.my-tabbar{
		background-color: white; 
		width: 100%;
		bottom: 0;
		border-top: 1rpx solid #e2e2e2;
		position: fixed;
	}
	.my-tab{
		width: 100%;
		padding: 24rpx 0;
		font-size: 30rpx;
		cursor: pointer;
		float: left;
		text-align: center;
	}
	.tag-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		margin: 10rpx 15rpx;
		justify-content: center;
	}
	.project-list{
		display: flex;
		justify-content:center;
	}	
	.project-list view{
		display: flex;
	}
</style>
