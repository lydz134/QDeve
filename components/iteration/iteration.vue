<template>
	<view>
		<view class="project-info">
			<view class="info">
				<view class="uni-h4 uni-common-mt">项目名:{{project.projectName}}</view>
				<view class="uni-h5 uni-common-mt">邀请码:{{project.projectCode}}</view>
			</view>
		</view>
		<view class="intro">
			<view class="info">
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?togglePopup('center', 'addIteration'):'none'"><view>{{isLeader == true?'+':'-'}}</view></view>
				<view class="text">迭代</view>
				<view class="button" :style="{'cursor':isLeader == true?'pointer':'none'}" @click="isLeader == true?togglePopup('center', 'delIteration'):'none'"><view>-</view></view>
			</view>
		</view>
		<view class="uni-padding-wrap"  style="margin-top: -1rpx;">	
			<view>
				<view class="uni-list">
					<checkbox-group @change="checkboxChange">
						<label  @longtap="longtap(iteration,iteration._id,iteration.iterationName,iteration.iterationDescription,iteration.startTime,iteration.endTime)" @click="jumpToIterationPage(iteration)" class="uni-list-cell uni-list-cell-pd" v-for="iteration in iterationList" :key="iteration._id">
							<view v-if="isLeader == true">
								<checkbox style="transform:scale(0.7)"  :value="iteration._id" :checked="iteration.checked" />
							</view>
							<view  style="width:600rpx;">{{iteration.iterationName}}</view> 
						</label>
						
					</checkbox-group>
				</view>
			</view>
			<uni-popup :animation="false" :maskClick="true" ref="addIteration" :type="type" :mask-click="false">
				<view class="uni-tip">
					<text class="uni-tip-title">增加迭代</text>
					<input class="uni-tip-content" type="text" v-model="iterationName" placeholder="迭代名称" />
					<input class="uni-tip-content" type="text" v-model="iterationDescription" placeholder="迭代描述" />
					<view class="uni-btn-v uni-tip-calender-button">
						<view @click="open('isBefore')">{{startTime}}</view>
						<text>></text>
						<view @click="open('isAfter')">{{endTime}}</view>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('addIteration')">取消</text>
						<text class="uni-tip-button" @click="confirm('addIteration')">确定</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="upIteration" :type="type" :mask-click="false">
				<view class="uni-tip">
					<text class="uni-tip-title">修改迭代</text>
					<input class="uni-tip-content" type="text" v-model="iterationName" placeholder="迭代名称" />
					<input class="uni-tip-content" type="text" v-model="iterationDescription" placeholder="迭代描述" />
					<view class="uni-btn-v uni-tip-calender-button">
						<view @click="open('isBefore')">{{startTime}}</view>
						<text>></text>
						<view @click="open('isAfter')">{{endTime}}</view>
					</view>
					<view class="uni-btn-v">
						<button class="uni-tip-sheet-button" style="background-color: #07abf5;color: #ffffff;" @tap="enterIteration">进入迭代</button>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('upIteration')">取消</text>
						<text class="uni-tip-button" @click="confirm('upIteration')">确定</text>
					</view>
				</view>
			</uni-popup>
			<uni-popup :animation="false" :maskClick="true" ref="delIteration" :type="type" :mask-click="false">
				<view class="uni-tip">
					<text class="uni-tip-title">删除选中迭代</text>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="cancel('delIteration')">取消</text>
						<text class="uni-tip-button" @click="confirm('delIteration')">确定</text>
					</view>
				</view>
			</uni-popup>
			<view class="calendar-content" v-if="showCalendar">
				<uni-calendar ref="calendar" :insert="info.insert" :range="info.range" @confirm="calenderConfirm" />
			</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	export default {
		components: {
			uniPopup,
			uniCalendar
		},
		computed: {
		    ...mapState(['isLeader','project'])
		},
		data(){
			return {
				timeBoxIndex:'',
				_id:'',
				iterationName:'',
				iterationDescription:'',
				startTime:' ',
				endTime:' ',
				showCalendar: false,
				type: '',
				iteration:{},
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: []
				},
				iterationList:[]
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
		},
		created() {
			this.getIteration()
		},
		methods:{
			...mapMutations(['setIteration']),
			enterIteration(){
				let th = this
				uni.navigateTo({
				    url: '../../pages/iterationpage/iterationpage',
					success() {
						th.setIteration(th.iteration)
					}
				});
				this.$refs['upIteration'].close()
			},
			open(timeBoxIndex) {
				this.$refs.calendar.open()
				this.timeBoxIndex = timeBoxIndex
			},
			calenderConfirm(e) {
				let dateTime = 0
				let minusDays = 0
				switch(this.timeBoxIndex){
					case 'isBefore':
						dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
					    minusDays = Math.floor((((new Date(this.endTime)).getTime() - (new Date(e.fulldate)).getTime()) / dateTime));
						if(minusDays < 0){
							break;
						}
						this.startTime = e.fulldate
						break;
					case 'isAfter':
						dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
						minusDays = Math.floor((((new Date(e.fulldate)).getTime() - (new Date(this.startTime)).getTime()) / dateTime));
						if(minusDays < 0){
							break;
						}
						this.endTime = e.fulldate
						break;	
				}
			},
			checkboxChange: function (e) {
				var iterationList = this.iterationList,
					values = e.detail.value;
				for (var i = 0, lenI = iterationList.length; i < lenI; ++i) {
					const iteration = iterationList[i]
					if(values.includes(iteration._id)){
						this.$set(iteration,'checked',true)
					}else{
						this.$set(iteration,'checked',false)
					}
				}
			},
			jumpToIterationPage(iteration){
				let th = this
				if(this.isLeader == false){
					uni.navigateTo({
					    url: '../../pages/iterationpage/iterationpage',
						success() {
							th.setIteration(iteration)
						}
					});
					this.$refs['upIteration'].close()
				}
				
			},
			togglePopup(type, open) {
				if(this.isLeader == true){
					let date = new Date()
					let now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					this.iterationName = ''
					this.iterationDescription = ''
					this.startTime = now
					this.endTime = now
					this.type = type
					this.$nextTick(() => {
						this.$refs[open ].open()
					})
				}
			},
			cancel(type) {
				this.$refs[type].close()
				this.iterationName = ''
				this.iterationDescription = ''
			},
			confirm(type) {
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				};
				
				switch(type){
					case "addIteration":
						uniCloud.callFunction({
						    name: 'addIteration',
						    data: {
								uniIdToken:this.uniIdToken,
								iterationName:this.iterationName,
								iterationDescription:this.iterationDescription,
								startTime:this.startTime,
								endTime:this.endTime,
								projectId:this.project._id
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getIteration()
							}
						});
						break;
					case "delIteration":
						let selectedList = []
						for (var i = 0, lenI = this.iterationList.length; i < lenI; ++i) {
							const iteration = this.iterationList[i]
							if(iteration.checked){
								selectedList.push({_id:iteration._id})
							}
						}
						uniCloud.callFunction({
						    name: 'delIteration',
						    data: {
								uniIdToken:this.uniIdToken,
								selectedList:selectedList
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getIteration()
							}
						});
						break;
					case "upIteration":
						uniCloud.callFunction({
						    name: 'upIteration',
						    data: {
								uniIdToken:this.uniIdToken,
								_id:this._id,
								iterationName:this.iterationName,
								iterationDescription:this.iterationDescription,
								startTime:this.startTime,
								endTime:this.endTime,
							},
							success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								th.getIteration()
							}
						});
						break;
				}
				this.$refs[type].close()
			},
			longtap(iteration,_id,iterationName,iterationDescription,startTime,endTime){
				if(this.isLeader == true){
					this.iteration = iteration
					this._id = _id
					this.iterationName = iterationName
					this.iterationDescription = iterationDescription
					this.startTime = startTime
					this.endTime = endTime
					this.type = "center"
					this.$nextTick(() => {
						this.$refs["upIteration"].open()
					})
				}
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
			}
		}
	}	
</script>

<style>
	
</style>
