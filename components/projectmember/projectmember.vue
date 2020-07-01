<template>
	<view>
		<view class="intro">
			<view class="info">
				<view class="button" style="cursor: none;"><view>-</view></view>
				<view class="text">项目成员</view>
				<view class="button" style="cursor: none;"><view>-</view></view>
			</view>
		</view>
		<view class="uni-padding-wrap" style="margin-top: -1rpx;">
			<checkbox-group >
				<label class="uni-list-cell uni-list-cell-pd" v-for="member in memberList" :key="member.uid">
					<view style="text-align: center;width:100%;">{{member.nickName}}</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	export default {
		computed: {
		    ...mapState(['isLeader','project'])
		},
		data(){
			return {
				memberList:[]
			}
		},
		created() {
			let th = this
			try {
			    const uniIdToken = uni.getStorageSync('uniIdToken');
			} catch (e) {
			    // error
			};
			uniCloud.callFunction({
			    name: 'getProjectMember',
			    data: {
					uniIdToken:this.uniIdToken,
					projectId:this.project._id
				}, 
				success(res){
					th.memberList = res.result.data
				}
			});
		}
	}	
</script>

<style>
</style>
