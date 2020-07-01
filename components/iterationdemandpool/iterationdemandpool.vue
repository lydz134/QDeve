<template>
	<view>
		<view class="project-info">
			<view class="info">
				<view class="uni-h4 uni-common-mt">迭代名:{{iteration.iterationName}}</view>
				<view class="uni-h5 uni-common-mt">描述:{{iteration.iterationDescription}}</view>
			</view>
		</view>
		<view class="intro">  
			<view class="info">
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?popList('demandList'):'none'"><view>{{isLeader == true?'+':'-'}}</view></view>
				<view class="text">需求</view>
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?togglePopup('center', 'deleteDemand'):'none'"><view>-</view></view>
			</view>
		</view>
		<view class="uni-padding-wrap"  style="margin-top: -1rpx;">	
			<view>
				<view class="uni-list">
					<checkbox-group @change="checkboxChange">
						<label v-for="iterationDemand in iterationDemandList" @longtap="longtap(iterationDemand)" class="uni-list-cell uni-list-cell-pd project-list" :key="iterationDemand._id">
							<view>
								<view v-if="isLeader == true">
									<view >
										<checkbox style="transform:scale(0.7)" :value="iterationDemand._id" :checked="iterationDemand.checked" />
									</view>
								</view>
								<view >{{iterationDemand.demandName}}</view>
							</view>
							<view v-if="iterationDemand.state == '1'" class="tag-view" >
								<uni-tag :inverted="true" text="完成" type="success" size="small"/>
							</view>
							<view v-if="iterationDemand.state == '0'" class="tag-view" >
								<uni-tag :inverted="true" text="未完成" type="warning" size="small"/>
							</view>
						</label>
					</checkbox-group>
				</view>
			</view>
			<uni-popup :animation="false" :maskClick="true" ref="upDemand" :type="type" :mask-click="false">
				<view v-if="isLeader == true" class="uni-tip">
					<text class="uni-tip-title">修改需求</text>
					<input class="uni-tip-content" type="text" v-model="demandName" placeholder="需求名称" />
					<input class="uni-tip-content" type="text" v-model="demandDescription" placeholder="需求描述" />
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #ffffff;color: #333333;" @tap="popList('stateList')">{{(state == '1')?'已完成':'未完成'}}</button>
					</view>
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #07abf5;color: #ffffff;" @tap="popList('memberList')">{{member.nickName}}</button>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('upDemand')">取消</text>
						<text class="uni-tip-button" @click="confirm('upDemand')">确定</text>
					</view>
				</view>
				<view v-if="isLeader == false" class="uni-tip">
					<text style="text-align: center;">{{demandDescription}}</text>
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #ffffff;color: #333333;" @tap="changeState()">{{(state == '1')?'已完成':'未完成'}}</button>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('upDemand')">返回</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="deleteDemand" :type="type" :mask-click="false">
				<view class="uni-tip">
					<text class="uni-tip-title">删除选中需求</text>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('deleteDemand')">取消</text>
						<text class="uni-tip-button" @click="confirm('deleteDemand')">确定</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="demandList" type="bottom" >
				<view class="memberlist">
					<scroll-view scroll-y="true" show-scrollbar="true" class="memberlist-scroll">
						<view class="memberlist-item" v-for="demand in demandList" :key="demand._id" @click="addIterationDemand(demand._id)">{{demand.demandName}}</view> 
					</scroll-view>
					<view class="memberlist-button" @click="cancel('demandList')">
						<text>取消</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="memberList" type="bottom" >
				<view class="memberlist">
					<scroll-view scroll-y="true" show-scrollbar="true" class="memberlist-scroll">
						<view class="memberlist-item" @click="setMember({_id:'',id:'',isLeader:'',nickName:'无',uid:''})">无</view>
						<view class="memberlist-item" v-for="member in memberList" :key="member._id" @click="setMember(member)">{{member.nickName}}</view> 
					</scroll-view>
					<view class="memberlist-button" @click="cancel('memberList')">
						<text>取消</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="stateList" type="bottom" >
				<view class="memberlist">
					<scroll-view scroll-y="true" show-scrollbar="true" class="memberlist-scroll">
						<view class="memberlist-item" v-for="state in stateList" :key="state.state" @click="setState(state)">{{state.name}}</view> 
					</scroll-view>
					<view class="memberlist-button" @click="cancel('stateList')">
						<text>取消</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	export default {
		components: {
			uniPopup,
			uniTag
		},
		computed: {
		    ...mapState(['isLeader','iteration','project'])
		},
		data(){
			return {
				_id: '',
				demandName: '',
				demandDescription: '',
				state: '',
				member:{},
				type: '',
				iterationDemandList:[],
				demandList:[],
				memberList:[],
				stateList: [{
						state: '0',
						name: '未完成'
					},
					{
						state: '1',
						name: '已完成',
					}
				],
			}
		},
		created() {
			this.getIterationDemand()
		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
		},
		methods:{
			changeState(){
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				if(this.isLeader == false){
					switch(th.state){
						case '0':
							let date = new Date()
							let now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
							uniCloud.callFunction({
							    name: 'changeIterationDemandState',
							    data: {
									uniIdToken:this.uniIdToken,
									_id:th._id ,
									state:'1',
									finishTime:now
								}, 
								success(res){
									uni.showToast({
										title: res.result.msg,
										duration: 2000
									});
									th.getIterationDemand()
								}
							});
							break;
						case '1':
							uniCloud.callFunction({
							    name: 'changeIterationDemandState',
							    data: {
									uniIdToken:this.uniIdToken,
									_id:th._id ,
									state:'0',
									finishTime:''
								}, 
								success(res){
									uni.showToast({
										title: res.result.msg,
										duration: 2000
									});
									th.getIterationDemand()
								}
							});
							break;	
					}
				}
				this.$refs['upDemand'].close()
			},
			popList(open) {
				switch(open){
					case 'demandList':
						this.getDemand()
						break;
					case 'memberList':
						this.getMember()
						break;
				}
				this.$nextTick(() => {
					this.$refs[open ].open()
				})
			},
			checkboxChange: function (e) { 
				var iterationDemandList = this.iterationDemandList,
					values = e.detail.value;
				for (var i = 0, lenI = iterationDemandList.length; i < lenI; ++i) {
					const iterationDemand = iterationDemandList[i]
					if(values.includes(iterationDemand._id)){
						this.$set(iterationDemand,'checked',true)
					}else{
						this.$set(iterationDemand,'checked',false)
					}
				}
			},
			togglePopup(type, open) {
				this.type = type
				this.$nextTick(() => {
					this.$refs[open ].open()
				})
			},
			cancel(type) {
				this.$refs[type].close()
			},
			confirm(type) {
				let th = this
				this.$refs[type].close()
				switch(type){
					case "deleteDemand":
						let selectedList = []
						for (var i = 0, lenI = this.iterationDemandList.length; i < lenI; ++i) {
							const iterationDemand = this.iterationDemandList[i]
							if(iterationDemand.checked){
								selectedList.push({_id:iterationDemand._id})
							}
						}
						uniCloud.callFunction({
						    name: 'delIterationDemand',
						    data: {
								uniIdToken:this.uniIdToken,
								selectedList:selectedList
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getIterationDemand()
							}
						});
						break;
					case "upDemand":
						try {
						    const uniIdToken = uni.getStorageSync('uniIdToken');
						} catch (e) {
						    // error
						};
						let date = new Date()
						let now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
						uniCloud.callFunction({
						    name: 'upIterationDemand',
						    data: {
								uniIdToken:this.uniIdToken,
								_id:this._id ,
								demandName:this.demandName,
								demandDescription:this.demandDescription,
								state:this.state,
								memberId:this.member._id,
								finishTime:now
							}, 
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getIterationDemand()
							}
						});
						break;
				}
				this.$refs[type].close()
			},
			longtap(iterationDemand){
				this._id = iterationDemand._id
				this.demandName = iterationDemand.demandName
				this.demandDescription = iterationDemand.demandDescription
				this.state = iterationDemand.state
				this.member = (iterationDemand.member.length == 0)?{_id:'',nickName:'分配给成员'}:iterationDemand.member[0]
				this.type = "center"
				this.$nextTick(() => {
					this.$refs["upDemand"].open()
				})
			},
			getIterationDemand(){
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				uniCloud.callFunction({
				    name: 'getIterationDemand',
				    data: {
						uniIdToken:this.uniIdToken,
						iterationId:this.iteration._id,
						projectId:this.project._id
					}, 
					success(res){
						th.iterationDemandList = res.result.data
					}
				});
			},
			getMember(){
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
			},
			addIterationDemand(demandId){
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				uniCloud.callFunction({
				    name: 'addIterationDemand',
				    data: {
						uniIdToken:this.uniIdToken,
						_id:demandId ,
						iterationId:this.iteration._id
					}, 
					success(res){
						uni.showToast({
							title: res.result.msg,
							duration: 2000
						});
						th.getIterationDemand()
					}
				});
				this.$refs['demandList'].close()
			},
			setMember(member){
				this.member = member
				this.$refs['memberList'].close()
			},
			setState(state){
				this.state = state.state
				this.$refs['stateList'].close()
			}
		}
	}	
</script>

<style>
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
		justify-content:space-between;
		align-items:center;
	}	
	.project-list view{
		display: flex;
		align-items:center;
	}
</style>
