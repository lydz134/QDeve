<template>
	<view>
		<view class="intro">
			<view class="info">
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?togglePopup('center', 'addDemand'):'none'"><view>{{isLeader == true?'+':'-'}}</view></view>
				<view class="text">需求池</view>
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?togglePopup('center', 'deleteDemand'):'none'"><view>-</view></view>
			</view>
		</view>
		<view class="uni-padding-wrap" style="margin-top: -1rpx;">
			<view>
				<view class="uni-list">
					<checkbox-group @change="checkboxChange">
						<label  @longtap="longtap(demand._id,demand.demandName,demand.demandDescription)" class="uni-list-cell uni-list-cell-pd" v-for="demand in demandList" :key="demand._id">
							<view v-if="isLeader == true">
								<checkbox style="transform:scale(0.7)" :value="demand._id" :checked="demand.checked" />
							</view>
							<view>{{demand.demandName}}</view>
						</label>
					</checkbox-group>
				</view>
			</view>
			<uni-popup :animation="false" :maskClick="true" ref="addDemand" :type="type">
				<view class="uni-tip">
					<text class="uni-tip-title">增加需求</text>
					<input class="uni-tip-content" type="text" v-model="demandName" placeholder="需求名称" />
					<input class="uni-tip-content" type="text" v-model="demandDescription" placeholder="需求描述" />
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #07abf5;color: #ffffff;" @tap="popIterationList('iterationList')">{{iteration.iterationName}}</button>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('addDemand')">取消</text>
						<text class="uni-tip-button" @click="confirm('addDemand')">确定</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="upDemand" :type="type">
				<view v-if="isLeader == true" class="uni-tip">
					<text class="uni-tip-title">修改需求</text>
					<input class="uni-tip-content" type="text" v-model="demandName" placeholder="需求名称" />
					<input class="uni-tip-content" type="text" v-model="demandDescription" placeholder="需求描述" />
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #07abf5;color: #ffffff;" @tap="popIterationList('iterationList')">{{iteration.iterationName}}</button>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('upDemand')">取消</text>
						<text class="uni-tip-button" @click="confirm('upDemand')">确定</text>
					</view>
				</view>
				<view v-if="isLeader == false"  class="uni-tip">
					<text style="text-align: center;">{{demandDescription}}</text>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('upDemand')">返回</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="deleteDemand" :type="type">
				<view class="uni-tip">
					<text class="uni-tip-title">删除选中需求</text>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('deleteDemand')">取消</text>
						<text class="uni-tip-button" @click="confirm('deleteDemand')">确定</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="iterationList" type="bottom" >
				<view class="memberlist">
					<scroll-view scroll-y="true" show-scrollbar="true" class="memberlist-scroll">
						<view class="memberlist-item" @click="selectMember({_id:'',iterationName:'无'})">无</view>
						<view class="memberlist-item" v-for="iteration in iterationList" @click="selectMember(iteration)" :key="iteration._id">{{iteration.iterationName}}</view> 
					</scroll-view>
					<view class="memberlist-button" @click="cancel('iterationList')">
						<text>取消</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	export default {
		components: {
			uniPopup
		},
		computed: {
		    ...mapState(['isLeader','project'])
		},
		data(){
			return {
				_id:'',
				demandName:'',
				demandDescription:'',
				iteration: {_id:'',iterationName:'分配给迭代'},
				type: '',
				demandList:[],
				iterationList: []
			}
		},
		created() {
			this.getDemand()
		},
		methods:{
			checkboxChange: function (e) {
				var demandList = this.demandList,
					values = e.detail.value;
				for (var i = 0, lenI = demandList.length; i < lenI; ++i) {
					const demand = demandList[i]
					if(values.includes(demand._id)){
						this.$set(demand,'checked',true)
					}else{
						this.$set(demand,'checked',false)
					}
				}
			},
			popIterationList(open) {
				this.getIteration()
				this.$nextTick(() => {
					this.$refs[open ].open()
				})
			},
			togglePopup(type, open) { 
				this.demandName = ''
				this.demandDescription = ''
				this.iteration = {_id:'',iterationName:'分配给迭代'}
				this.type = type
				this.$nextTick(() => {
					this.$refs[open].open()
				})
			},
			cancel(type) {
				this.$refs[type].close()
			},
			confirm(type) {
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				this.$refs[type].close()
				switch(type){
					case "addDemand":
						uniCloud.callFunction({
						    name: 'addDemand',
						    data: {
								uniIdToken:this.uniIdToken,
								demandName:this.demandName,
								demandDescription:this.demandDescription,
								projectId:this.project._id,
								iterationId:this.iteration._id
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getDemand()
							}
						});
						break;
					case "deleteDemand":
						let selectedList = []
						for (var i = 0, lenI = this.demandList.length; i < lenI; ++i) {
							const demand = this.demandList[i]
							if(demand.checked){
								selectedList.push({_id:demand._id})
							}
						}
						console.info(selectedList)
						uniCloud.callFunction({
						    name: 'delDemand',
						    data: {
								uniIdToken:this.uniIdToken,
								selectedList:selectedList
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getDemand()
							}
						});
						break;
					case "upDemand":
						uniCloud.callFunction({
						    name: 'upDemand',
						    data: {
								uniIdToken:this.uniIdToken,
								_id:this._id,
								demandName:this.demandName,
								demandDescription:this.demandDescription,
								iterationId:this.iteration._id 
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getDemand()
							}
						});
						break;
				}
				this.$refs[type].close()
			},
			longtap(_id,demandName,demandDescription){
				this._id = _id
				this.demandName = demandName
				this.demandDescription = demandDescription
				this.iteration = {_id:'',iterationName:'分配给迭代'}
				this.type = "center"
				this.$nextTick(() => {
					this.$refs["upDemand"].open()
				})
			},
			getIteration(){
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				uniCloud.callFunction({
				    name: 'getIteration',
				    data: {
						uniIdToken:this.uniIdToken,
						projectId:this.project._id
					}, 
					success(res){
						th.iterationList = res.result.data
					}
				});
			},
			selectMember(iteration){
				this.iteration = iteration
				this.$refs['iterationList'].close()
			},
			getDemand(){
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				uniCloud.callFunction({
				    name: 'getDemand',
				    data: {
						uniIdToken:this.uniIdToken,
						projectId:this.project._id 
					}, 
					success(res){
						th.demandList = res.result.data
					}
				});
			}
		}
	}	
</script>

<style>
	
</style>
